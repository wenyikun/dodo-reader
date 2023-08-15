# Dodo Reader README

Dodo Reader is a Visual Studio Code extension that allows reading various formats like EPUB/PDF.

## Features

![example](https://res.vekun.com/uploads/1-1691948958974.png)

1. Place the EPUB/PDF file in the workspace, and click to open the file.
2. Content display area.
3. Switch between the previous chapter and the next chapter using buttons or `left`/`right` keys.
4. Toggle the display of the table of contents.

## Getting Started

To set up the development environment, start by launching the webview static page packaging:

```sh
npm run web:watch
```

To activate the extension, press `F5`.

For building the production code:

```sh
npm run vscode:prepublish
```
