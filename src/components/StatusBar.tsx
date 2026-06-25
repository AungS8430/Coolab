import type { CursorPosition } from '../types';
import { useFilesStore } from '../store/files';

function StatusBar({ cursorPosition }: { cursorPosition: CursorPosition | null }) {
  const { activeFile } = useFilesStore();
  const file = activeFile();
  return (
    <div>
      <div>{file?.name}</div>
      <div>{file?.language}</div>
      <div>
        {cursorPosition ? `Ln ${cursorPosition.line}, Col ${cursorPosition.column}` : 'Ln 1, Col 1'}
      </div>
    </div>
  )
}


export { StatusBar };
