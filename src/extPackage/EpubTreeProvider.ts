import path = require('path');
import * as vscode from 'vscode';

export default class EpubTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
  treeDataResolve: (value: any[]) => void = () => { }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    console.log('getTreeItem')
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    console.log('getChildren')
    return new Promise((resolve, reject) => {
      new Promise((treeDataResolve) => {
        this.treeDataResolve = treeDataResolve
      }).then((value: any) => {
        const items = value.map((item: any) => {
          if (item.subitems.length > 0) {
            return new vscode.TreeItem(item.label, vscode.TreeItemCollapsibleState.Expanded)
          } else {
            return new vscode.TreeItem(item.label, vscode.TreeItemCollapsibleState.None)
          }
        })
        resolve(items)
      })
    })
  }

  setTreeData(data: any[]) {
    this.treeDataResolve(data)
  }
}