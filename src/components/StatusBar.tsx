import { useFilesStore } from '../store/files';

function StatusBar() {
  const { activeFile } = useFilesStore();
  const file = activeFile();
  return (
    <div className='flex justify-between not-only-of-type:bg-statusbar backdrop-blur-xl border-t border-border text-muted text-xs py-1'>
      <div className='flex items-center *:px-2 divide-x divide-border-strong'>

      </div>
      <div className='flex items-center *:px-2 divide-x divide-border-strong'>
        <text className='my-auto'>{file?.name}</text>
        <text>{file?.language}</text>
        <text>{file ? `Ln ${file.cursorPosition.line}, Col ${file.cursorPosition.column}` : 'Ln 1, Col 1'}</text>
      </div>
    </div>
  )
}


export { StatusBar };
