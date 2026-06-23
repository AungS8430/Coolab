import { useRef } from 'react';

import MonacoEditor, { type OnMount, type OnChange } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

import type { CursorPosition, EditorTheme } from '../types';

interface EditorProps {
  value: string;
  language: string;
  theme: EditorTheme;
  onChange: (value: string) => void;
  onCursorMove?: (position: CursorPosition | undefined) => void;
  readOnly?: boolean;
}

function Editor({
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

    editor.focus();
  }

  const handleChange: OnChange = (value) => {
    if (value !== undefined) onChange(value);
  }
  return (
    <MonacoEditor
    height="100%"
    language={language}
    value={value}
    onChange={handleChange}
    onMount={handleMount}
    theme={theme}
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
