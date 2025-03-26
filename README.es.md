# Documentación de Dodo Reader

Dodo Reader es una extensión de Visual Studio Code que permite leer varios formatos como EPUB/PDF e integra Copilot AI para ayudar en tu lectura.

**Idiomas**: [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [Português](README.pt.md)

## Características

1. Soporta lectura de EPUB/PDF.
2. EPUB se adapta a los temas de VSCode.
3. EPUB soporta chat con Copilot.

## Interfaz

![ejemplo](https://res.vekun.com/uploads/1-1691948958974.png)

1. Coloca el archivo EPUB/PDF en el espacio de trabajo y haz clic para abrir el archivo.
2. Área de visualización de contenido.
3. Cambia entre el capítulo anterior y el siguiente usando botones o las teclas `izquierda`/`derecha`.
4. Alterna la visualización de la tabla de contenidos.

## Chatear con Copilot

1. Abre un archivo EPUB.
2. Abre el panel de Copilot e invoca el rol `dodo-reader`.
   ![](https://fe.vekun.com/pic-fly/1spqbuptr.jpg)

3. Puedes chatear, traducir o resumir todo el texto o el texto seleccionado.
   ![](https://fe.vekun.com/pic-fly/rhn70wnk.jpg)

## Primeros pasos

Para configurar el entorno de desarrollo, comienza lanzando el empaquetado de la página estática webview:

```sh
npm run web:watch
```

Para activar la extensión, presiona `F5`.

Para construir el código de producción:

```sh
npm run vscode:prepublish
```
