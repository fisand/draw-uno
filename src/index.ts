import type { DecorationOptions, TextEditor } from 'vscode'
import { DecorationRangeBehavior, Range, window, workspace } from 'vscode'

const regex = /flex\s+flex\-row\s+justify\-start\s+items\-center\s+gap\-4/g

const HideDecorationType = window.createTextEditorDecorationType({
  textDecoration: 'none; display: none;',
})
const InlineDecoration = window.createTextEditorDecorationType({
  textDecoration: 'none; opacity: 0.6 !important;',
  rangeBehavior: DecorationRangeBehavior.ClosedClosed,
})

let decorations: DecorationOptions[] = []
let editor: TextEditor | undefined

function execText() {
  if (!editor)
    return
  const document = editor.document
  const text = document.getText()
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text))) {
    const startPos = document.positionAt(match.index)
    const endPos = document.positionAt(match.index + match[0].length)
    const decoration: DecorationOptions = {
      range: new Range(startPos, endPos),
      hoverMessage: `#### ${match[0]}`, // 添加悬停消息
      renderOptions: {
        before: {
          width: 'auto',
          contentText: 'un...o',
          color: 'blue',
          textDecoration: 'none; border-bottom: 1px solid green; box-sizing: border-box;',
        },
      },
    }
    decorations.push(decoration)
  }
}

function updateText() {
  if (!editor)
    return
  execText()
  editor.setDecorations(
    InlineDecoration,
    decorations.map(({ range }) => ({
      range,
    })),
  )
  editor.setDecorations(
    HideDecorationType,
    decorations.filter(i => i.range.start.line !== editor!.selection.start.line),
  )
}

function combineText() {
  if (!editor)
    return
  execText()
  editor.setDecorations(
    InlineDecoration,
    decorations.map(({ range, renderOptions }) => ({
      range,
      renderOptions,
    })).filter(i => i.range.start.line === editor!.selection.start.line),
  )
  editor.setDecorations(
    HideDecorationType,
    decorations.filter(i => i.range.start.line !== editor!.selection.start.line),
  )
}

function reset() {
  if (!editor)
    return

  decorations = []
  editor.setDecorations(HideDecorationType, [])
  editor.setDecorations(InlineDecoration, [])
}

function updateEditor(editor_: TextEditor | undefined) {
  if (editor_)
    editor = editor_
}

export function activate() {
  workspace.onDidChangeTextDocument(() => {
    reset()
    updateText()
  })

  window.onDidChangeTextEditorSelection(() => {
    reset()
    combineText()
  })

  updateEditor(window.activeTextEditor)
  updateText()
}

export function deactivate() {}
