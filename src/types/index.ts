interface FileNode {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: number;
  cursorPosition: CursorPosition;
}

interface CursorPosition {
  line: number;
  column: number;
}

type EditorTheme = 'light' | 'vs-dark';

export type { FileNode, CursorPosition, EditorTheme };
