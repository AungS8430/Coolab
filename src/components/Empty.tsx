import { useState } from 'react';
import { useFilesStore } from '../store/files';

import { SquareDashed, Plus, X } from 'lucide-react';

function Empty() {
  const { createFile } = useFilesStore();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');

  const handleCreateFile = () => {
    if (newFileName.trim()) createFile(newFileName.trim());
    setIsCreating(false);
    setNewFileName('');
  }
  const handleCancelCreateFile = () => {
    setIsCreating(false);
    setNewFileName('');
  }
  const handleCreateFileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateFile();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFileName('');
    }
  }
  return (
    <div className='flex flex-col justify-center items-center gap-4 h-full'>
      <div className='p-4 bg-muted/50 rounded-xl drop-shadow-2xl'>
        <SquareDashed size={50} />
      </div>
      <div className='flex flex-col justify-center items-center'>
        <text className='text-xl font-semibold text-primary'>No files are open</text>
        <text className='font-medium text-secondary'>Select a file or create one</text>
      </div>
      { isCreating ? (
          <div className='flex items-center'>
            <input value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleCreateFileKeyDown} className='rounded-l-lg overflow-scroll border border-border rounded-sm w-48 focus:ring-0 focus:outline-none py-1 px-3' />
            <button className='aspect-square h-full flex justify-center items-center bg-muted/30 hover:bg-muted/10 transition-all' onClick={handleCancelCreateFile}><X className='size-em' /></button>
            <button className='aspect-square h-full flex justify-center items-center bg-primary hover:bg-primary/80 transition-all rounded-r-lg' onClick={handleCreateFile}><Plus className='size-em text-black' /></button>
          </div>
        ) : (
          <button onClick={() => setIsCreating(true)} className='flex gap-2 items-center py-1 px-3 rounded-lg bg-primary hover:bg-primary/80 transition-all text-black shadow'><Plus className='size-em' />Create File</button>
        )
      }
    </div>
  )
}

export { Empty };
