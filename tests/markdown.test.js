const assert = require("node:assert/strict");
const test = require("node:test");

const markdown = require("../vendor/markdown-js/markdown.min.js");
const render = (source) => markdown.toHTML(source, "Maruku");

test("renders a table and its column alignments", () => {
  const html = render(`| Name | Score | Result |
| :--- | ---: | :---: |
| Ada | 95 | Passed |`);

  assert.match(html, /<table>/);
  assert.match(html, /<th align="left">Name<\/th>/);
  assert.match(html, /<th align="right">Score<\/th>/);
  assert.match(html, /<td align="center">Passed<\/td>/);
});

test("supports inline Markdown and escaped pipes in table cells", () => {
  const html = render(`Feature | Value
--- | ---
Style | **simple**
Symbol | A \\| B`);

  assert.match(html, /<strong>simple<\/strong>/);
  assert.match(html, /<td>A \| B<\/td>/);
});

test("still renders ordinary Markdown", () => {
  const html = render("# Title\n\nA **simple** viewer.");

  assert.match(html, /<h1>Title<\/h1>/);
  assert.match(html, /<strong>simple<\/strong>/);
});
