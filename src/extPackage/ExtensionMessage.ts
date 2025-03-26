import type { Webview } from 'vscode'
import * as vscode from 'vscode'
import axios from 'axios'
import {
  FETCH,
  CONFIG,
  SHOW_INFORMATION_MESSAGE,
  SET_TOC,
  DO_COPY,
  DO_TRANSLATE,
  CONTENTS,
  GET_CONTENT,
} from '../utils/messageTypes'

class ExtensionMessage {
  webview: Webview
  callbacks: Map<string, any> = new Map()
  promises: Map<string, any> = new Map()
  constructor(webview: Webview) {
    this.webview = webview
    webview.onDidReceiveMessage((message) => {
      if (message.command.startsWith(FETCH)) {
        this.fetch(message.command, message.data)
      } else if (message.command.startsWith(CONFIG)) {
        // const config = vscode.workspace.getConfiguration('dodo-reader')
        this.webview.postMessage({
          command: message.command,
          data: {
            // chatApi: config.chatApi,
            // chatApiKey: config.chatApiKey,
            // chatModel: config.chatModel,
            isDarkTheme: this.isDarkTheme(),
          },
        })
      } else if (message.command === SHOW_INFORMATION_MESSAGE) {
        vscode.window.showInformationMessage(message.data)
      } else if (message.command === GET_CONTENT) {
        const promise = this.promises.get(GET_CONTENT)
        promise?.resolve(message.data)
      } else if (message.command === SET_TOC || message.command === CONTENTS) {
        const callbacks = this.callbacks.get(message.command)
        for (const callback of callbacks) {
          callback(message.data)
        }
      }
    })
  }

  fetch(command: string, data: any) {
    axios
      .request(data)
      .then((res) => {
        if (data.responseType === 'stream') {
          res.data.on('data', (chunk: any) => {
            this.webview.postMessage({
              command: command,
              data: chunk.toString(),
              success: true,
              finished: false,
            })
          })
          res.data.on('end', () => {
            this.webview.postMessage({
              command: command,
              data: null,
              success: true,
              finished: true,
            })
          })
          return
        }
        this.webview.postMessage({
          command: command,
          data: res.data,
          success: true,
        })
      })
      .catch((err) => {
        this.webview.postMessage({
          command: command,
          data: null,
          success: false,
        })
      })
  }

  doCopy() {
    this.webview.postMessage({
      command: DO_COPY,
    })
  }

  doTranslate() {
    this.webview.postMessage({
      command: DO_TRANSLATE,
    })
  }

  getContent() {
    const promise = new Promise((resolve, reject) => {
      this.promises.set(GET_CONTENT, { resolve, reject })
    })
    this.webview.postMessage({
      command: GET_CONTENT,
    })
    return promise
  }

  isDarkTheme() {
    return vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
  }

  on(type: string, callback: (data: any) => any) {
    if (this.callbacks.has(type)) {
      this.callbacks.get(type).push(callback)
    } else {
      this.callbacks.set(type, [callback])
    }
  }
}

export default ExtensionMessage
