# Dodo Reader 说明文档

Dodo Reader 是一个 Visual Studio Code 扩展，允许阅读 EPUB/PDF 等多种格式，并集成 Copilot AI 辅助您的阅读。

**语言**: [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [Português](README.pt.md)

## 功能特点

1. 支持 EPUB/PDF 阅读。
2. EPUB 适配 VSCode 主题。
3. EPUB 支持 Copilot 聊天。

## 界面

![示例](https://res.vekun.com/uploads/1-1691948958974.png)

1. 将 EPUB/PDF 文件放入工作区，点击打开文件。
2. 内容显示区域。
3. 使用按钮或 `左`/`右` 键切换上一章和下一章。
4. 切换目录显示。

## 与 Copilot 聊天

1. 打开 EPUB 文件。
2. 打开 Copilot 面板并召唤 `dodo-reader` 角色。
   ![](https://fe.vekun.com/pic-fly/1spqbuptr.jpg)

3. 您可以聊天、翻译或总结全文或选定文本。
   ![](https://fe.vekun.com/pic-fly/rhn70wnk.jpg)

## 入门指南

要设置开发环境，首先启动 webview 静态页面打包：

```sh
npm run web:watch
```

要激活扩展，按`F5`。

构建生产代码：

```sh
npm run vscode:prepublish
```
