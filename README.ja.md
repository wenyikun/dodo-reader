# Dodo Reader 説明書

Dodo Reader は、EPUB/PDF などの様々なフォーマットの読書を可能にし、Copilot AI を統合して読書をサポートする Visual Studio Code 拡張機能です。

**言語**: [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [Português](README.pt.md)

## 機能

1. EPUB/PDF 読書をサポート。
2. EPUB は VSCode テーマに適応。
3. EPUB は Copilot チャットをサポート。

## インターフェース

![例](https://res.vekun.com/uploads/1-1691948958974.png)

1. EPUB/PDF ファイルをワークスペースに配置し、クリックしてファイルを開きます。
2. コンテンツ表示エリア。
3. ボタンまたは `左`/`右` キーを使用して前の章と次の章を切り替えます。
4. 目次の表示を切り替えます。

## Copilot とチャット

1. EPUB ファイルを開きます。
2. Copilot パネルを開き、`dodo-reader` ロールを呼び出します。
   ![](https://fe.vekun.com/pic-fly/1spqbuptr.jpg?t=1)

3. チャット、翻訳、または全文や選択したテキストの要約ができます。
   ![](https://fe.vekun.com/pic-fly/rhn70wnk.jpg)

## 始め方

開発環境をセットアップするには、まず webview 静的ページのパッケージングを開始します：

```sh
npm run web:watch
```

拡張機能を有効にするには、`F5`を押します。

本番コードをビルドするには：

```sh
npm run vscode:prepublish
```
