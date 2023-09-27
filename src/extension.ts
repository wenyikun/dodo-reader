import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import EpubEditorProvider from './extPackage/EpubEditorProvider';
import PdfEditorProvider from './extPackage/PdfEditorProvider';

export function activate(context: ExtensionContext) {
	// "views": {
	// 	"explorer": [
	// 		{
	// 			"id": "epubTree",
	// 			"name": "Epub TOC",
	// 			"when": "resourceExtname == .epub"
	// 		}
	// 	]
	// },
	// const epubTreeProvider = new EpubTreeProvider();
	// vscode.window.registerTreeDataProvider('epubTree', epubTreeProvider);

	const epubProvider = new EpubEditorProvider(context);
	context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.epubEditor', epubProvider));

	const pdfProvider = new PdfEditorProvider(context);
	context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.pdfEditor', pdfProvider));

	const copyDisposable = vscode.commands.registerCommand('dodo-reader.copy', () => {
		epubProvider.doCopy()
	});
	context.subscriptions.push(copyDisposable);

	const translateDisposable = vscode.commands.registerCommand('dodo-reader.translate', async () => {
		const config = vscode.workspace.getConfiguration('dodo-reader')
		if (!config.get('chatApiKey') || !config.get('chatApi')) {
			const result = await vscode.window.showInformationMessage(epubProvider.contents!["chatTips"], epubProvider.contents!["yes"], epubProvider.contents!["no"])
			if (result === epubProvider.contents!["yes"]) {
				vscode.commands.executeCommand('workbench.action.openSettings', 'dodo-reader')
			}
			return
		}

		epubProvider.doTranslate()
	});
	context.subscriptions.push(translateDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
