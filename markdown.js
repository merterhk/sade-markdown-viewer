(function () {
  "use strict";

  const escapeHtml = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  function inline(value) {
    let text = escapeHtml(value);
    const code = [];
    text = text.replace(/`([^`]+)`/g, (_, content) => {
      code.push(`<code>${content}</code>`);
      return `\u0000CODE${code.length - 1}\u0000`;
    });
    text = text
      .replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>");
    return text.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => code[Number(index)]);
  }

  function render(markdown) {
    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    const output = [];
    let paragraph = [];
    let list = null;
    let quote = [];
    let code = null;

    const flushParagraph = () => {
      if (paragraph.length) output.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    };
    const flushList = () => {
      if (list) output.push(`<${list.type}>${list.items.map((item) => `<li>${inline(item)}</li>`).join("")}</${list.type}>`);
      list = null;
    };
    const flushQuote = () => {
      if (quote.length) output.push(`<blockquote>${render(quote.join("\n"))}</blockquote>`);
      quote = [];
    };
    const flushAll = () => { flushParagraph(); flushList(); flushQuote(); };

    for (const line of lines) {
      const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
      if (fence) {
        if (code) {
          output.push(`<pre><code${code.language ? ` data-language="${escapeHtml(code.language)}"` : ""}>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
          code = null;
        } else {
          flushAll();
          code = { language: fence[1], lines: [] };
        }
        continue;
      }
      if (code) { code.lines.push(line); continue; }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      const listItem = line.match(/^\s*([-+*]|\d+[.)])\s+(.+)$/);
      const quoteLine = line.match(/^>\s?(.*)$/);
      if (heading) {
        flushAll();
        const level = heading[1].length;
        output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      } else if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
        flushAll(); output.push("<hr>");
      } else if (quoteLine) {
        flushParagraph(); flushList(); quote.push(quoteLine[1]);
      } else if (listItem) {
        flushParagraph(); flushQuote();
        const type = /^\d/.test(listItem[1]) ? "ol" : "ul";
        if (list && list.type !== type) flushList();
        if (!list) list = { type, items: [] };
        list.items.push(listItem[2]);
      } else if (!line.trim()) {
        flushAll();
      } else {
        flushList(); flushQuote(); paragraph.push(line.trim());
      }
    }
    if (code) output.push(`<pre><code>${escapeHtml(code.lines.join("\n"))}</code></pre>`);
    flushAll();
    return output.join("\n");
  }

  window.simpleMarkdown = { render };
}());
