import * as vscode from 'vscode'
import type { CustomEditorProvider, CustomDocument, WebviewPanel, CancellationToken, ExtensionContext } from 'vscode'
import { readFileSync } from 'fs'
import ExtensionMessage from './ExtensionMessage'
import EpubTreeProvider from './EpubTreeProvider'
import { SET_TOC, CONTENTS } from '../utils/messageTypes'
import { dirname } from 'path'

class EpubDocument implements CustomDocument {
  uri: vscode.Uri

  constructor(uri: vscode.Uri) {
    this.uri = uri
  }

  dispose(): void {}
}

class EpubEditorProvider implements Partial<CustomEditorProvider> {
  context: vscode.ExtensionContext
  contents: { [key: string]: any } | null = null
  editors: {
    extensionMessage: ExtensionMessage
    webviewPanel: WebviewPanel
  }[] = []
  constructor(context: vscode.ExtensionContext) {
    this.context = context
  }

  async resolveCustomEditor(document: CustomDocument, webviewPanel: WebviewPanel, _token: CancellationToken) {
    const fileUrl = webviewPanel.webview.asWebviewUri(document.uri).toString()
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(dirname(document.uri.fsPath)), this.context.extensionUri],
    }
    webviewPanel.webview.html = this.getWebviewContent(webviewPanel, fileUrl)
    const extensionMessage = new ExtensionMessage(webviewPanel.webview)
    extensionMessage.on(CONTENTS, (data) => {
      this.contents = data
    })
    this.editors.push({ extensionMessage, webviewPanel })
    webviewPanel.onDidDispose(() => {
      const index = this.editors.findIndex((item) => item.webviewPanel === webviewPanel)
      this.editors.splice(index, 1)
    })
  }

  getActiveEditor() {
    return this.editors.find((item) => item.webviewPanel.active)
  }

  async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ) {
    return new EpubDocument(uri)
  }

  private getWebviewContent(webviewPanel: WebviewPanel, fileUrl: string) {
    const extensionUri = this.context.extensionUri
    const staticUri = vscode.Uri.joinPath(extensionUri, 'dist/web/')

    let webviewContent = readFileSync(vscode.Uri.joinPath(extensionUri, 'dist/web/index.html').fsPath, {
      encoding: 'utf-8',
    })
    webviewContent = webviewContent
      .replace('BASE_URL', webviewPanel.webview.asWebviewUri(staticUri).toString())
      .replace('FILE_URL', fileUrl)
      .replace('PAGE_NAME', 'epub_reader')
      .replace('LANGUAGE', vscode.env.language)

    return webviewContent
  }

  doCopy() {
    this.getActiveEditor()?.extensionMessage.doCopy()
  }

  doTranslate() {
    this.getActiveEditor()?.extensionMessage.doTranslate()
  }

  getContent() {
    return this.getActiveEditor()?.extensionMessage.getContent()
  }
}

export default EpubEditorProvider
