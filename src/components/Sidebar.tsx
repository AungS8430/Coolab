import { useState } from 'react';
import { useFilesStore } from '../store/files';
import type { FileNode } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';

import { Check, FilePlus, PenLine, Plus, Trash, X } from 'lucide-react';

function FileNameInput({ value, defaultValue, onChange, onKeyDown }: { value: string, defaultValue?: string, onChange: React.ChangeEventHandler<HTMLInputElement>, onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> }) {
  return (
    <input type='text' autoFocus value={value} onChange={onChange} onKeyDown={onKeyDown} defaultValue={defaultValue} onClick={(e) => e.stopPropagation()} className='flex-1 overflow-scroll min-w-0 border border-border rounded-sm focus:ring-0 focus:outline-none' />
  )
}

function Sidebar() {
  const { files, createFile, deleteFile, renameFile, openFile, activeFileId } = useFilesStore();
  const [newFileName, setNewFileName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const renameRef = useClickOutside(() => {
    setRenamingId(null);
    setIsCreating(false)
    setNewFileName('');
  })

  const toggleCreate = () => {
    setRenamingId(null);
    setNewFileName('');
    setIsCreating(!isCreating);
  }

  const toggleRename = (file: FileNode) => {
    if (renamingId !== file.id) {
      setIsCreating(false);
      setNewFileName(file.name);
      setRenamingId(file.id);
    } else {
      setRenamingId(null);
      setNewFileName('');
    }
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) createFile(newFileName.trim());
    setIsCreating(false);
    setNewFileName('');
  }

  const handleRenameFile = () => {
    if (newFileName.trim()) renameFile(renamingId!, newFileName.trim());
    setRenamingId(null);
    setNewFileName('');
  }

  const handleOpenFile = (file: FileNode) => {
    setRenamingId(null);
    setIsCreating(false);
    openFile(file.id);
  }

  const handleCreateFileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateFile();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFileName('');
    }
  }

  const handleRenameFileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameFile();
    if (e.key === 'Escape') {
      setRenamingId(null);
      setNewFileName('');
    }
  }

  return (
    <div className='w-48 h-full flex flex-col bg-sidebar border-r border-border shadow-sidebar divide-y divide-border z-20'>
      <div className='flex justify-between'>
        <div className='p-3 text-xs text-muted uppercase font-semibold my-auto'>Explorer</div>
        <button onClick={toggleCreate} className='text-xs aspect-square hover:bg-secondary/50 my-auto p-2 mx-2 rounded-md transition-all'><FilePlus className='size-em' /></button>
      </div>
      <div className='pt-1'>
        { isCreating &&
          <div ref={renameRef} className='flex flex-row text-[12.5px] px-1.5 py-0.5 h-7 gap-1'>
            <FileNameInput value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleCreateFileKeyDown} />
            <button onClick={toggleCreate} className='hover:bg-secondary/50 my-auto p-1 rounded-md aspect-square text-xs transition-all'><X className='size-em' /></button>
            <button onClick={handleCreateFile} className='hover:bg-secondary/50 my-auto p-1 rounded-md aspect-square text-xs transition-all'><Plus className='size-em' /></button>
          </div>
        }
        {
          files.map((file) => {
            return (
              <div key={file.id} onClick={(e) => {e.stopPropagation(); handleOpenFile(file)}} className={'flex flex-row px-1.5 py-0.5 h-7 gap-1 text-[12.5px] hover:bg-file-hover transition-all ' + (file.id === activeFileId ? 'bg-file-active border-l-2 border-border-strong text-primary' : 'border-l-2 border-l-transparent hover:bg-[rgba(255,255,255,0.04)] text-secondary')}>
                {
                  renamingId === file.id ? (
                    <div ref={renameRef} className='contents'>
                      <FileNameInput value={newFileName} defaultValue={file.name} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleRenameFileKeyDown} />
                      <button onClick={(e) => {e.stopPropagation(); setRenamingId(null); setNewFileName('')}} className='hover:bg-secondary/50 my-auto p-1 rounded-md aspect-square text-xs transition-all'><X className='size-em' /></button>
                      <button onClick={(e) => {e.stopPropagation(); handleRenameFile()}} className='hover:bg-secondary/50 my-auto p-1 rounded-md aspect-square text-xs transition-all'><Check className='size-em' /></button>
                    </div>
                  ) : (
                    <>
                      <div className='my-auto flex-1 truncate'>{file.name}</div>
                      <button onClick={(e) => {e.stopPropagation(); toggleRename(file)}} className='hover:bg-secondary/50 my-auto p-1 rounded-md aspect-square text-xs transition-all'><PenLine className='size-em' /></button>
                      <button onClick={(e) => {e.stopPropagation(); deleteFile(file.id)}} className='hover:bg-secondary/50 my-auto p-1 rounded-md aspect-square text-xs transition-all'><Trash className='size-em' /></button>
                    </>
                  )
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export { Sidebar }
