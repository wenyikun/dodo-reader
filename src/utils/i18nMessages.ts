const messages = {
  'zh-CN': {
    copy: '复制',
    translate: "翻译",
    copySuccess: '内容已复制到剪贴板',
    copyFail: '复制失败',
    errorMessage: '网络错误，请重试！',
    systemMessage: '你是一个翻译助手，用户将会提供一段{sourceLang}文本，你需要保留原格式并翻译成{targetLang}，不需要其他任何说明。',
    retranslate: '重新翻译',
    autoCheck: '自动检测',
    chatTips: '操作依赖于ChatGPT，需要配置请求参数，是否去配置?',
    yes: '是',
    no: '否'
  },
  'en-US': {
    copy: 'Copy',
    translate: 'Translate',
    copySuccess: 'Content has been copied to the clipboard',
    copyFail: 'Copy failed',
    errorMessage: 'Network error, please try again!',
    systemMessage: 'You are a translation assistant, the user will provide a piece of {sourceLang} text, and you need to retain the original format and translate it into {targetLang}, without any further instructions.',
    retranslate: 'Retranslate',
    autoCheck: 'Auto Detect',
    chatTips: 'Operation depends on ChatGPT, do you want to configure the request parameters?',
    yes: 'Yes',
    no: 'No'
  },
  'fr-FR': {
    copy: 'Copier',
    translate: 'Traduire',
    copySuccess: 'Le contenu a été copié dans le presse-papiers',
    copyFail: 'Échec de la copie',
    errorMessage: 'Erreur réseau, veuillez réessayer !',
    systemMessage: `Vous êtes un assistant de traduction, l'utilisateur fournira un texte en {sourceLang}, et vous devez conserver le format d'origine et le traduire en {targetLang}, sans autres instructions.`,
    retranslate: 'Retraduire',
    autoCheck: 'Détection automatique',
    chatTips: `L'opération dépend de ChatGPT, voulez-vous configurer les paramètres de la demande ?`,
    yes: 'Oui',
    no: 'Non'
  },
  'ja-JP': {
    copy: 'コピー',
    translate: '翻訳',
    copySuccess: 'コンテンツがクリップボードにコピーされました',
    copyFail: 'コピーに失敗しました',
    errorMessage: 'ネットワークエラー、もう一度試してください！',
    systemMessage: 'あなたは翻訳アシスタントです。ユーザーは{sourceLang}のテキストを提供します。元の形式を保ち、それを{targetLang}に翻訳する必要があります。追加の説明は必要ありません。',
    retranslate: '再翻訳',
    autoCheck: '自動検出',
    chatTips: '操作はChatGPTに依存しています。リクエストパラメータを設定しますか？',
    yes: 'はい',
    no: 'いいえ'
  }
};


export const langs = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'fr-FR': 'Français',
  'ja-JP': '日本語'
}

export default messages
