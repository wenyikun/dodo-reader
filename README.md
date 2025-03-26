# Dodo Reader README

Dodo Reader is a Visual Studio Code extension that allows reading various formats like EPUB/PDF and integrates Copilot AI to assist your reading.

**Languages**: [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [Português](README.pt.md)

## Features

1. Supports EPUB/PDF reading.
2. EPUB adapts to VSCode themes.
3. EPUB supports Copilot chat.

## Interface

![example](https://res.vekun.com/uploads/1-1691948958974.png)

1. Place the EPUB/PDF file in the workspace, and click to open the file.
2. Content display area.
3. Switch between the previous chapter and the next chapter using buttons or `left`/`right` keys.
4. Toggle the display of the table of contents.

## Chat with Copilot

1. Open an EPUB file.
2. Open the Copilot panel and summon the `dodo-reader` role.
   ![](https://fe.vekun.com/pic-fly/1spqbuptr.jpg?t=1)

3. You can chat, translate, or summarize the entire text or selected text.
   ![](https://fe.vekun.com/pic-fly/rhn70wnk.jpg)

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
