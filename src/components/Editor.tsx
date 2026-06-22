import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  value: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

function Editor({ value, language, onChange, readOnly = false }: EditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  function handleMount(editor: any, monaco: any) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    editor.focus();
  }
  return (
    <MonacoEditor
    height="90vh"
    language={language}
    value={value}
    onChange={onChange}
    onMount={handleMount}
    options={{
      fontSize: 14,
      fontFamily: '"JetBrains Mono", monospace',
      fontLigatures: true,
      readOnly: readOnly,
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

export default Editor;