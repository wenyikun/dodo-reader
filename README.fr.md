# Documentation Dodo Reader

Dodo Reader est une extension Visual Studio Code qui permet de lire différents formats comme EPUB/PDF et intègre Copilot AI pour vous aider dans votre lecture.

**Langues**: [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [Français](README.fr.md) | [Español](README.es.md) | [Português](README.pt.md)

## Fonctionnalités

1. Prend en charge la lecture EPUB/PDF.
2. EPUB s'adapte aux thèmes VSCode.
3. EPUB prend en charge le chat Copilot.

## Interface

![exemple](https://res.vekun.com/uploads/1-1691948958974.png)

1. Placez le fichier EPUB/PDF dans l'espace de travail et cliquez pour ouvrir le fichier.
2. Zone d'affichage du contenu.
3. Passez du chapitre précédent au chapitre suivant à l'aide des boutons ou des touches `gauche`/`droite`.
4. Basculez l'affichage de la table des matières.

## Discuter avec Copilot

1. Ouvrez un fichier EPUB.
2. Ouvrez le panneau Copilot et invoquez le rôle `dodo-reader`.
   ![](https://fe.vekun.com/pic-fly/1spqbuptr.jpg?t=1)

3. Vous pouvez discuter, traduire ou résumer l'ensemble du texte ou le texte sélectionné.
   ![](https://fe.vekun.com/pic-fly/rhn70wnk.jpg)

## Premiers pas

Pour configurer l'environnement de développement, commencez par lancer l'empaquetage de la page statique webview :

```sh
npm run web:watch
```

Pour activer l'extension, appuyez sur `F5`.

Pour construire le code de production :

```sh
npm run vscode:prepublish
```
