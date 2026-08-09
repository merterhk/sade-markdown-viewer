# Sade Markdown Viewer

A lightweight Firefox extension that turns `.md` and `.markdown` files into clean, comfortable reading pages. “Sade” means “simple” in Turkish and reflects the extension's focused design.

## Install

### Firefox Add-ons

Publication on Firefox Add-ons is pending. This section is ready for the official listing URL:

<!-- After AMO publication, replace REPLACE_WITH_AMO_SLUG and uncomment the next line. -->
<!-- [Install from Firefox Add-ons](https://addons.mozilla.org/firefox/addon/REPLACE_WITH_AMO_SLUG/) -->

Until then, packaged versions are available from [GitHub Releases](https://github.com/merterhk/sade-markdown-viewer/releases/latest).

### Temporary installation for development

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Select **Load Temporary Add-on**.
3. Choose `manifest.json` from this repository.
4. Open the extension's settings and enable access to local files.

Open or drag a `.md` file into Firefox. The button in the upper-right corner cycles through **System → Light → Dark** and remembers your preference.

## Features

- System, light, and dark themes
- Remembers the selected theme
- English and Turkish localization, with English as the fallback
- Works with local Markdown files and direct Markdown URLs
- No tracking, advertising, accounts, or external services
- No build dependencies

## Supported Markdown

Headings, paragraphs, bold and italic text, strikethrough, links, remote images, ordered and unordered lists, blockquotes, horizontal rules, inline code, and fenced code blocks.

## Build the store package

Validate and package the extension with Mozilla's `web-ext` tool:

```sh
web-ext lint
web-ext build --overwrite-dest
```

The ZIP package is written to `web-ext-artifacts`. Store descriptions, privacy copy, and permission explanations are available in `STORE-LISTING.md`.

## Privacy

Sade Markdown Viewer does not collect or transmit personal data. Only the selected theme preference is stored locally by Firefox. Remote images referenced by a Markdown document may be loaded from addresses specified by that document's author.

## License

[MIT](LICENSE)
