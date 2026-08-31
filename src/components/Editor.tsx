import { useRef } from 'react';

import MonacoEditor, { type OnMount, type OnChange } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

import type { CursorPosition, EditorTheme } from '../types';

interface EditorProps {
  path: string;
  value: string;
  language: string;
  theme: EditorTheme;
  onChange: (value: string) => void;
  onCursorMove?: (position: CursorPosition) => void;
  readOnly?: boolean;
}

function Editor({
  path,
  value,
  language,
  theme,
  onChange,
  onCursorMove,
  readOnly = false
}: EditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      strict: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      esModuleInterop: true,
    })

    editor.onDidChangeCursorPosition((e) => {
      onCursorMove?.({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })

    monaco.editor.defineTheme('collab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword',    foreground: 'c7a0dc' },
        { token: 'string',     foreground: 'c4907a' },
        { token: 'number',     foreground: 'b8956a' },
        { token: 'comment',    foreground: '464648', fontStyle: 'italic' },
        { token: 'type',       foreground: '7aad96' },
        { token: 'identifier', foreground: 'b0c4d8' },
        { token: 'delimiter',  foreground: '525256' },
        { token: 'function',   foreground: '8eb4d4' },
        { token: '',           foreground: 'dddde3' },
      ],
      colors: {
        // surfaces
        'editor.background':                   '#171719',
        'editor.foreground':                   '#dddde3',
        'editorGutter.background':             '#171719',

        // cursor
        'editorCursor.foreground':             '#dddde3',
        'editorCursor.background':             '#171719',

        // line highlight
        'editor.lineHighlightBackground':      '#ffffff04',
        'editor.lineHighlightBorder':          '#00000000',

        // selection
        'editor.selectionBackground':          '#ffffff18',
        'editor.inactiveSelectionBackground':  '#ffffff0e',
        'editor.selectionHighlightBackground': '#ffffff0a',

        // find
        'editor.findMatchBackground':          '#c4907a44',
        'editor.findMatchHighlightBackground': '#c4907a22',
        'editor.findMatchBorder':              '#c4907a88',

        // line numbers
        'editorLineNumber.foreground':         '#303035',
        'editorLineNumber.activeForeground':   '#44444a',

        // indent guides
        'editorIndentGuide.background1':        '#ffffff06',
        'editorIndentGuide.activeBackground1':  '#ffffff12',

        // brackets
        'editorBracketMatch.background':       '#ffffff10',
        'editorBracketMatch.border':           '#8e8e9666',

        // bracket pair colorization
        'editorBracketHighlight.foreground1':  '#8eb4d4',
        'editorBracketHighlight.foreground2':  '#c7a0dc',
        'editorBracketHighlight.foreground3':  '#7aad96',

        // scrollbar
        'scrollbarSlider.background':          '#ffffff07',
        'scrollbarSlider.hoverBackground':     '#ffffff12',
        'scrollbarSlider.activeBackground':    '#ffffff1a',
        'scrollbar.shadow':                    '#00000000',

        // minimap
        'minimap.background':                  '#141416',
        'minimapSlider.background':            '#ffffff07',
        'minimapSlider.hoverBackground':       '#ffffff12',

        // widget backgrounds (autocomplete, hover, etc)
        'editorWidget.background':             '#1e1e21',
        'editorWidget.border':                 '#ffffff0e',
        'editorWidget.foreground':             '#8e8e96',
        'editorSuggestWidget.background':      '#1e1e21',
        'editorSuggestWidget.border':          '#ffffff0e',
        'editorSuggestWidget.selectedBackground': '#ffffff08',
        'editorSuggestWidget.highlightForeground': '#dddde3',

        // hover widget
        'editorHoverWidget.background':        '#1e1e21',
        'editorHoverWidget.border':            '#ffffff0e',

        // peek view
        'peekView.border':                     '#ffffff0e',
        'peekViewEditor.background':           '#171719',
        'peekViewResult.background':           '#1e1e21',
        'peekViewTitle.background':            '#1e1e21',

        // git decorations
        'gitDecoration.modifiedResourceForeground':  '#8eb4d4aa',
        'gitDecoration.addedResourceForeground':     '#7aad96aa',
        'gitDecoration.deletedResourceForeground':   '#c4907aaa',
        'gitDecoration.untrackedResourceForeground': '#7aad9688',
      }
    })

    monaco.editor.setTheme('collab-dark')

    fetch('https://unpkg.com/@types/react@18/index.d.ts')
      .then(r => r.text())
      .then(text => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(text, 'file:///node_modules/@types/react/index.d.ts')
      });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    })

    editor.focus();
  }

  const handleChange: OnChange = (value) => {
    if (value !== undefined) onChange(value);
  }
  return (
    <MonacoEditor
      path={path}
      height="100%"
      language={language}
      value={value}
      onChange={handleChange}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: '"JetBrains Mono", monospace',
        fontLigatures: true,
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        formatOnType: true,
        formatOnPaste: true,
        automaticLayout: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        renderLineHighlight: 'gutter'
      }}
    />
  )
}

export { Editor };
