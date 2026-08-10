(async function () {
  "use strict";

  const path = location.pathname.toLowerCase();
  if (!path.endsWith(".md") && !path.endsWith(".markdown")) return;
  if (document.documentElement.dataset.markdownViewer) return;

  const sourceNode = document.querySelector("body > pre") || document.body;
  const source = sourceNode.textContent || "";
  if (!source.trim()) return;

  const sanitizeRenderedMarkdown = (rendered) => {
    const allowedAttributes = {
      a: new Set(["href", "title"]),
      img: new Set(["src", "alt", "title"]),
      th: new Set(["align"]),
      td: new Set(["align"])
    };
    const safeProtocols = {
      href: new Set(["http:", "https:", "file:", "mailto:"]),
      src: new Set(["http:", "https:", "file:"])
    };

    for (const element of rendered.body.querySelectorAll("*")) {
      const allowed = allowedAttributes[element.localName] || new Set();
      for (const attribute of [...element.attributes]) {
        if (!allowed.has(attribute.name)) element.removeAttribute(attribute.name);
      }
      for (const attribute of ["href", "src"]) {
        if (!element.hasAttribute(attribute)) continue;
        try {
          const protocol = new URL(element.getAttribute(attribute), location.href).protocol;
          if (!safeProtocols[attribute].has(protocol)) element.removeAttribute(attribute);
        } catch {
          element.removeAttribute(attribute);
        }
      }
    }

    for (const link of rendered.body.querySelectorAll("a")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    for (const image of rendered.body.querySelectorAll("img")) image.loading = "lazy";
  };

  document.documentElement.dataset.markdownViewer = "true";
  const saved = await browser.storage.local.get("theme");
  let theme = saved.theme || "system";
  const isTurkish = browser.i18n.getUILanguage().toLowerCase().startsWith("tr");
  const strings = isTurkish ? {
    system: "Sistem", light: "Açık", dark: "Koyu", changeTheme: "Temayı değiştir"
  } : {
    system: "System", light: "Light", dark: "Dark", changeTheme: "Change theme"
  };

  document.head.innerHTML = "";
  const meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1";
  document.head.append(meta);
  document.title = decodeURIComponent(path.split("/").pop()) || "Markdown";

  document.body.innerHTML = `
    <header class="viewer-bar">
      <div class="viewer-file"></div>
      <button class="theme-button" type="button">
        <span aria-hidden="true"></span><span class="theme-name"></span>
      </button>
    </header>
    <main class="markdown-body"></main>`;

  const icons = { system: "◐", light: "☀", dark: "☾" };
  const themeButton = document.querySelector(".theme-button");
  themeButton.setAttribute("aria-label", strings.changeTheme);
  themeButton.title = strings.changeTheme;
  const applyTheme = () => {
    document.documentElement.dataset.theme = theme;
    document.querySelector(".theme-button span").textContent = icons[theme];
    document.querySelector(".theme-name").textContent = strings[theme];
  };

  document.querySelector(".viewer-file").textContent = document.title;
  const rendered = new DOMParser().parseFromString(window.markdown.toHTML(source, "Maruku"), "text/html");
  sanitizeRenderedMarkdown(rendered);
  for (const table of rendered.body.querySelectorAll("table")) {
    const wrapper = rendered.createElement("div");
    wrapper.className = "table-scroll";
    table.before(wrapper);
    wrapper.append(table);
  }
  document.querySelector(".markdown-body").replaceChildren(...rendered.body.childNodes);
  themeButton.addEventListener("click", async () => {
    theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    applyTheme();
    await browser.storage.local.set({ theme });
  });
  applyTheme();
}());
