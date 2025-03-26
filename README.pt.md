# Documentação do Dodo Reader

Dodo Reader é uma extensão do Visual Studio Code que permite a leitura de vários formatos como EPUB/PDF e integra o Copilot AI para auxiliar na sua leitura.

**Idiomas**: [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [Português](README.pt.md)

## Recursos

1. Suporta leitura de EPUB/PDF.
2. EPUB se adapta aos temas do VSCode.
3. EPUB suporta chat com Copilot.

## Interface

![exemplo](https://res.vekun.com/uploads/1-1691948958974.png)

1. Coloque o arquivo EPUB/PDF no espaço de trabalho e clique para abrir o arquivo.
2. Área de exibição de conteúdo.
3. Alterne entre o capítulo anterior e o próximo usando botões ou teclas `esquerda`/`direita`.
4. Alterne a exibição do sumário.

## Conversar com o Copilot

1. Abra um arquivo EPUB.
2. Abra o painel do Copilot e invoque o papel `dodo-reader`.
   ![](https://fe.vekun.com/pic-fly/1spqbuptr.jpg?t=1)

3. Você pode conversar, traduzir ou resumir todo o texto ou o texto selecionado.
   ![](https://fe.vekun.com/pic-fly/rhn70wnk.jpg)

## Primeiros passos

Para configurar o ambiente de desenvolvimento, comece lançando o empacotamento da página estática webview:

```sh
npm run web:watch
```

Para ativar a extensão, pressione `F5`.

Para construir o código de produção:

```sh
npm run vscode:prepublish
```
