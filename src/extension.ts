import * as vscode from 'vscode'
import type { ExtensionContext } from 'vscode'
import EpubEditorProvider from './extPackage/EpubEditorProvider'
import PdfEditorProvider from './extPackage/PdfEditorProvider'
import { readFileSync } from 'fs'

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

  const epubProvider = new EpubEditorProvider(context)
  context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.epubEditor', epubProvider))

  const pdfProvider = new PdfEditorProvider(context)
  context.subscriptions.push(vscode.window.registerCustomEditorProvider('dodo-reader.pdfEditor', pdfProvider))

  const copyDisposable = vscode.commands.registerCommand('dodo-reader.copy', () => {
    epubProvider.doCopy()
  })
  context.subscriptions.push(copyDisposable)

  const translateDisposable = vscode.commands.registerCommand('dodo-reader.translate', async () => {
    // const config = vscode.workspace.getConfiguration('dodo-reader')
    // if (!config.get('chatApiKey') || !config.get('chatApi')) {
    //   const result = await vscode.window.showInformationMessage(
    //     epubProvider.contents!['chatTips'],
    //     epubProvider.contents!['yes'],
    //     epubProvider.contents!['no']
    //   )
    //   if (result === epubProvider.contents!['yes']) {
    //     vscode.commands.executeCommand('workbench.action.openSettings', 'dodo-reader')
    //   }
    //   return
    // }

    // epubProvider.doTranslate()
  })
  context.subscriptions.push(translateDisposable)

  // {
  //   "command": "dodo-reader.chat",
  //   "when": "webviewId == 'dodo-reader.epubEditor'"
  // }

  const chatDisposable = vscode.commands.registerCommand('dodo-reader.chat', async () => {
    const panel = vscode.window.createWebviewPanel(
      'chatView', // Identifies the type of the webview. Used internally
      'Chat', // Title of the panel displayed to the user
      vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
      {
        enableScripts: true, // Enable scripts in the webview
        localResourceRoots: [context.extensionUri],
      }
    )
    const staticUri = vscode.Uri.joinPath(context.extensionUri, 'dist/web/')

    let webviewContent = readFileSync(vscode.Uri.joinPath(context.extensionUri, 'dist/web/index.html').fsPath, {
      encoding: 'utf-8',
    })

    // 测试模型调用
    try {
      const [model] = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' })
      const chatResponse = await model.sendRequest(
        [
          vscode.LanguageModelChatMessage.User(
            `Translate to Chinese：\nIn America buyers have long enjoyed 30-year fixed-rate prepayable mortgages courtesy of the federal government. It implicitly guarantees mortgage-backed securities that are sold to investors through agencies such as Fannie Mae and Freddie Mac. The average 30-year rate stands at over 7.2%, the highest since 2001. It is now clear that anyone who borrowed in, say, early 2021, when the rate was 2.7%, secured the deal of a lifetime—especially as house prices have gone on to rise by nearly a third.`
          ),
        ],
        {},
        new vscode.CancellationTokenSource().token
      )
      for await (const fragment of chatResponse.text) {
        console.log(fragment)
      }
    } catch (error) {
      console.log(error)
    }

    webviewContent = webviewContent
      .replace('BASE_URL', panel.webview.asWebviewUri(staticUri).toString())
      .replace('FILE_URL', '')
      .replace('PAGE_NAME', 'chat')

    panel.webview.html = webviewContent
  })
  context.subscriptions.push(chatDisposable)

  // "chatParticipants": [
  //   {
  //     "id": "chat-ai.dodo-reader",
  //     "fullName": "Dodo Reader",
  //     "name": "dodo-reader",
  //     "description": "有什么问题可以问我哦！",
  //     "isSticky": true,
  //     "commands": [
  //       {
  //         "name": "translate",
  //         "description": "Type target language to translate the text."
  //       }
  //     ]
  //   }
  // ]

  const tutor = vscode.chat.createChatParticipant(
    'chat-ai.dodo-reader',
    async (
      request: vscode.ChatRequest,
      context: vscode.ChatContext,
      stream: vscode.ChatResponseStream,
      token: vscode.CancellationToken
    ) => {
      const messages = []
      const previousMessages = context.history.filter((h) => h instanceof vscode.ChatResponseTurn)
      previousMessages.forEach((m: any) => {
        let fullMessage = ''
        m.response.forEach((r: any) => {
          const mdPart = r as vscode.ChatResponseMarkdownPart
          fullMessage += mdPart.value.value
        })
        messages.push(vscode.LanguageModelChatMessage.Assistant(fullMessage))
      })

      if (!epubProvider.getActiveEditor()) {
        return stream.markdown(vscode.l10n.t('Please open the epub file to ask questions~'))
      }
      const content = (await epubProvider.getContent()) as string

      // messages.push(vscode.LanguageModelChatMessage.User(content))
      if (request.command === 'translate') {
        messages.push(
          vscode.LanguageModelChatMessage.User(
            vscode.l10n.t('Translate into {0}:', request.prompt || vscode.env.language) + '\n' + content
          )
        )
      } else if (request.command === 'summarize') {
        messages.push(vscode.LanguageModelChatMessage.User(vscode.l10n.t('Summarize the text:') + '\n' + content))
      } else {
        messages.push(vscode.LanguageModelChatMessage.User(request.prompt + '\n' + content))
      }

      const chatResponse = await request.model.sendRequest(messages, {}, token)

      for await (const fragment of chatResponse.text) {
        stream.markdown(fragment)
      }

      return
    }
  )

  tutor.iconPath = vscode.Uri.joinPath(context.extensionUri, 'dist/web/logo.png')
}

// This method is called when your extension is deactivated
export function deactivate() {}
