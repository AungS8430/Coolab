import { useFilesStore } from '../store/files';

function StatusBar() {
  const { activeFile } = useFilesStore();
  const file = activeFile();
  return (
    <div>
      <div>{file?.name}</div>
      <div>{file?.language}</div>
      <div>
        {file ? `Ln ${file.cursorPosition.line}, Col ${file.cursorPosition.column}` : 'Ln 1, Col 1'}
      </div>
    </div>
  )
}


export { StatusBar };
