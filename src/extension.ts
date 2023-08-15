import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import EpubEditorProvider from './extPackage/EpubEditorProvider';
import PdfEditorProvider from './extPackage/PdfEditorProvider';

export function activate(context: ExtensionContext) {
	const epubProvider = new EpubEditorProvider(context);
	context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.epubEditor', epubProvider));

	const pdfProvider = new PdfEditorProvider(context);
	context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.pdfEditor', pdfProvider));
}

// This method is called when your extension is deactivated
export function deactivate() { }
