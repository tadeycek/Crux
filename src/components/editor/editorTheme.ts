import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const cruxTheme = EditorView.theme({
  '&': {
    color: '#b3b8c4',
    backgroundColor: '#131419',
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
    backgroundColor: 'oklch(0.30 0.05 278 / 0.18)',
    boxShadow: 'inset 2px 0 0 oklch(0.72 0.14 278)',
  },
  '.cm-gutters': {
    backgroundColor: '#131419',
    borderRight: '1px solid #20232b',
    color: '#5b626e',
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
    color: '#e6e8ed',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'oklch(0.45 0.12 278 / 0.45)',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: 'oklch(0.45 0.12 278 / 0.45)',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"Geist Mono", ui-monospace, Menlo, monospace',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'oklch(0.45 0.12 278 / 0.3)',
    outline: '1px solid oklch(0.72 0.14 278 / 0.5)',
  },
}, { dark: true })

export const cruxHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.keyword,                    color: 'oklch(0.75 0.13 320)', fontStyle: 'italic' },
  { tag: tags.string,                     color: 'oklch(0.78 0.11 145)' },
  { tag: tags.number,                     color: 'oklch(0.78 0.12 60)'  },
  { tag: tags.comment,                    color: 'oklch(0.52 0.02 250)', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName),color: 'oklch(0.78 0.11 220)' },
  { tag: tags.function(tags.definition(tags.variableName)), color: 'oklch(0.78 0.11 220)' },
  { tag: tags.definition(tags.variableName), color: '#b3b8c4' },
  { tag: tags.variableName,               color: '#b3b8c4' },
  { tag: tags.typeName,                   color: 'oklch(0.78 0.10 195)' },
  { tag: tags.className,                  color: 'oklch(0.78 0.11 220)' },
  { tag: tags.self,                       color: 'oklch(0.73 0.13 25)',  fontStyle: 'italic' },
  { tag: tags.operator,                   color: 'oklch(0.72 0.02 260)' },
  { tag: tags.punctuation,                color: '#7e8593' },
  { tag: tags.bool,                       color: 'oklch(0.75 0.13 320)', fontStyle: 'italic' },
  { tag: tags.null,                       color: 'oklch(0.75 0.13 320)', fontStyle: 'italic' },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: '#b3b8c4' },
  { tag: tags.special(tags.string),       color: 'oklch(0.78 0.11 145)' },
]))
