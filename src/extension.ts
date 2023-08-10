import * as vscode from 'vscode';
import type { CustomEditorProvider, CustomDocument, WebviewPanel, CancellationToken, ExtensionContext } from 'vscode';
import { readFileSync } from 'fs'


class EpubDocument implements CustomDocument {
	uri: vscode.Uri;
	data: Uint8Array;

	constructor(uri: vscode.Uri, data: Uint8Array) {
		this.uri = uri;
		this.data = data;
	}

	dispose(): void { }
}

class EpubEditorProvider implements Partial<CustomEditorProvider> {
	context: vscode.ExtensionContext
	constructor(context: vscode.ExtensionContext) {
		this.context = context
	}

	async resolveCustomEditor(document: CustomDocument, webviewPanel: WebviewPanel, _token: CancellationToken) {
		webviewPanel.webview.html = this.getWebviewContent(webviewPanel);
	}

	async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken) {
		return new EpubDocument(uri, new Uint8Array(0));
	}

	private getWebviewContent(webviewPanel: WebviewPanel) {
		const extensionUri = this.context.extensionUri
		const staticUri = vscode.Uri.joinPath(extensionUri, 'dist/web/')
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [staticUri]
		};

		let webviewContent = readFileSync(vscode.Uri.joinPath(extensionUri, 'dist/web/index.html').fsPath, { encoding: 'utf-8' })
		webviewContent = webviewContent.replace('BASE_URL', webviewPanel.webview.asWebviewUri(staticUri).toString())

		return webviewContent
	}
}

export function activate(context: ExtensionContext) {
	const provider = new EpubEditorProvider(context);
	context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.epubEditor', provider));
}

// This method is called when your extension is deactivated
export function deactivate() { }
