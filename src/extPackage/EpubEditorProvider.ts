import * as vscode from 'vscode';
import type { CustomEditorProvider, CustomDocument, WebviewPanel, CancellationToken, ExtensionContext } from 'vscode';
import { readFileSync } from 'fs'

class EpubDocument implements CustomDocument {
	uri: vscode.Uri;

	constructor(uri: vscode.Uri) {
		this.uri = uri;
	}

	dispose(): void { }
}

class EpubEditorProvider implements Partial<CustomEditorProvider> {
	context: vscode.ExtensionContext
	constructor(context: vscode.ExtensionContext) {
		this.context = context
	}

	async resolveCustomEditor(document: CustomDocument, webviewPanel: WebviewPanel, _token: CancellationToken) {
		const fileData = JSON.stringify(Array.from(new Uint8Array(readFileSync(document.uri.fsPath))))
		webviewPanel.webview.html = this.getWebviewContent(webviewPanel, fileData);
	}

	async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken) {
		return new EpubDocument(uri)
	}

	private getWebviewContent(webviewPanel: WebviewPanel, fileData: string) {
		const extensionUri = this.context.extensionUri
		const staticUri = vscode.Uri.joinPath(extensionUri, 'dist/web/')
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [staticUri]
		};

		let webviewContent = readFileSync(vscode.Uri.joinPath(extensionUri, 'dist/web/index.html').fsPath, { encoding: 'utf-8' })
		webviewContent = webviewContent.replace('BASE_URL', webviewPanel.webview.asWebviewUri(staticUri).toString()).replace('FILE_DATA', fileData)

		return webviewContent
	}
}

export default EpubEditorProvider
