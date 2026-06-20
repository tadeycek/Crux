import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

// All colors reference CSS variables so light/dark theme switching works automatically.
export const teleryTheme = EditorView.theme({
  '&': {
    color: 'var(--fg-2)',
    backgroundColor: 'var(--bg-inset)',
    height: '100%',
    fontSize: '12.5px',
    fontFamily: '"Geist Mono", ui-monospace, Menlo, monospace',
  },
  '.cm-content': {
    padding: '14px 16px',
    lineHeight: '1.65',
    caretColor: 'oklch(0.78 0.12 278)',
  },
  '.cm-cursor': {
    borderLeftColor: 'oklch(0.78 0.12 278)',
    borderLeftWidth: '2px',
  },
  '.cm-focused .cm-cursor': {
    borderLeftColor: 'oklch(0.78 0.12 278)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--editor-active-line)',
    boxShadow: 'inset 2px 0 0 oklch(0.72 0.14 278)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--bg-inset)',
    borderRight: '1px solid var(--border-soft)',
    color: 'var(--fg-4)',
    minWidth: '52px',
    padding: '14px 0',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 10px 0 0',
    minWidth: '44px',
    textAlign: 'right',
    lineHeight: '1.65',
    fontSize: '12.5px',
    fontFamily: '"Geist Mono", ui-monospace, Menlo, monospace',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: 'var(--fg)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'oklch(0.45 0.12 278 / 0.35)',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'oklch(0.45 0.12 278 / 0.35)',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"Geist Mono", ui-monospace, Menlo, monospace',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'oklch(0.45 0.12 278 / 0.3)',
    outline: '1px solid oklch(0.72 0.14 278 / 0.5)',
  },
})

export const teleryHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.keyword,                    color: 'var(--c-kw)',      fontStyle: 'italic' },
  { tag: tags.string,                     color: 'var(--c-str)'  },
  { tag: tags.number,                     color: 'var(--c-num)'  },
  { tag: tags.comment,                    color: 'var(--c-com)',     fontStyle: 'italic' },
  { tag: tags.function(tags.variableName),color: 'var(--c-fn)'  },
  { tag: tags.function(tags.definition(tags.variableName)), color: 'var(--c-fn)' },
  { tag: tags.definition(tags.variableName), color: 'var(--fg-2)' },
  { tag: tags.variableName,               color: 'var(--fg-2)'  },
  { tag: tags.typeName,                   color: 'var(--c-builtin)' },
  { tag: tags.className,                  color: 'var(--c-fn)'  },
  { tag: tags.self,                       color: 'var(--c-self)',    fontStyle: 'italic' },
  { tag: tags.operator,                   color: 'var(--c-op)'  },
  { tag: tags.punctuation,                color: 'var(--fg-3)'  },
  { tag: tags.bool,                       color: 'var(--c-kw)',      fontStyle: 'italic' },
  { tag: tags.null,                       color: 'var(--c-kw)',      fontStyle: 'italic' },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: 'var(--fg-2)' },
  { tag: tags.special(tags.string),       color: 'var(--c-str)'  },
]))
