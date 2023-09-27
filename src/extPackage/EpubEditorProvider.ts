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

  dispose(): void { }
}

class EpubEditorProvider implements Partial<CustomEditorProvider> {
  context: vscode.ExtensionContext
  extensionMessage: ExtensionMessage | null = null
  contents: {[key: string]: any} | null = null
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
    this.extensionMessage = new ExtensionMessage(webviewPanel.webview)
    this.extensionMessage.on(CONTENTS, (data) => {
      this.contents = data
    })
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

    return webviewContent
  }

  doCopy() {
    this.extensionMessage?.doCopy()
  }

  doTranslate() {
    this.extensionMessage?.doTranslate()
  }
}

export default EpubEditorProvider
