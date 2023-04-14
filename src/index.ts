import type { DecorationOptions } from 'vscode'
import { Range, window, workspace } from 'vscode'

const decorationType = window.createTextEditorDecorationType({
  textDecoration: 'none; display: none;',
})

export function activate() {
  window.showInformationMessage('Hello')

  function updateText() {
    const editor = window.activeTextEditor
    if (editor) {
      const document = editor.document
      const regex = /your-regular-expression/g // 替换为你的正则表达式
      const text = document.getText()
      let match
      const decorations: DecorationOptions[] = []

      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(text))) {
        const startPos = document.positionAt(match.index)
        const endPos = document.positionAt(match.index + match[0].length)
        const decoration: DecorationOptions = {
          range: new Range(startPos, endPos),
          hoverMessage: match[0], // 添加悬停消息
          renderOptions: {
            before: {
              width: 'auto',
              contentText: 'draw-uno',
            },
          },
        }
        decorations.push(decoration)
      }

      editor.setDecorations(decorationType, [])
      editor.setDecorations(decorationType, decorations)
    }
  }

  workspace.onDidChangeTextDocument(() => {
    updateText()
  })

  updateText()
}

export function deactivate() {}
