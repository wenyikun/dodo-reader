import { readFileSync } from 'fs';
import path = require('path');
import * as vscode from 'vscode';
import type { CustomEditorProvider, CustomDocument, WebviewPanel, CancellationToken, ExtensionContext } from 'vscode';

class PdfEditorProvider implements Partial<CustomEditorProvider> {
  context: vscode.ExtensionContext
  constructor(context: vscode.ExtensionContext) {
    this.context = context
  }

  resolveCustomEditor(document: CustomDocument, webviewPanel: WebviewPanel, _token: CancellationToken) {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.dirname(document.uri.fsPath)), this.context.extensionUri]
    };
    const base = vscode.Uri.joinPath(this.context.extensionUri, 'dist/web/pdf/web/')
    webviewPanel.webview.html = readFileSync(path.join(base.fsPath, 'viewer.html'), 'utf8').replace('<head>', `<head>
      <base href="${webviewPanel.webview.asWebviewUri(base).toString()}">
      <script>
      window.addEventListener('load', async function () {
        PDFViewerApplication.initializedPromise.then(() => {
          setTimeout(() => {
            PDFViewerApplication.open({url: "${webviewPanel.webview.asWebviewUri(document.uri)}"})
          })
        })
      })
      </script>
      <style>
        body {
          padding: 0;
        }
      </style>
    `)
  }

  async saveCustomDocument(document: CustomDocument, _cancellation: CancellationToken): Promise<void> {
    throw new Error(`Not implemented`)
  }

  openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken) {
    return {
      uri,
      dispose: () => { }
    }
  }
}

export default PdfEditorProvider