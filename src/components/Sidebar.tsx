import React, { useEffect, useRef, useState } from 'react';
import { useFilesStore } from '../store/files';
import type { FileNode } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';
import { Check, FilePlus, FolderPlus, PenLine, Plus, Trash, X } from 'lucide-react';

function FileNameInput({
  value,
  defaultValue,
  onChange,
  onKeyDown,
}: {
  value: string
  defaultValue?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}) {
  return (
    <input
      type='text'
      autoFocus
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      defaultValue={defaultValue}
      onClick={(e) => e.stopPropagation()}
      className='flex-1 overflow-scroll min-w-0 border border-border rounded-sm focus:ring-0 focus:outline-none bg-transparent text-text-primary'
    />
  )
}

interface TreeNodeProps {
  node: FileNode
  depth: number
  files: FileNode[]
  isCreatingFile: boolean
  isCreatingFolder: boolean
  renamingId: string | null
  cursorOn: string | null
  setCursorOn: (id: string | null) => void
  getNearestDir: (id: string) => string | null
  renameRef: React.RefObject<HTMLDivElement | null>
  handleOpenFile: (file: FileNode) => void
  newFileName: string
  setNewFileName: (name: string) => void
  setRenamingId: (id: string | null) => void
  handleRenameFile: () => void
  handleRenameFileKeyDown: (e: React.KeyboardEvent) => void
  toggleRename: (file: FileNode) => void
  toggleCreateFile: () => void
  handleCreateFile: () => void
  handleCreateFileKeyDown: (e: React.KeyboardEvent) => void
  toggleCreateFolder: () => void
  handleCreateFolder: () => void
  handleCreateFolderKeyDown: (e: React.KeyboardEvent) => void
  deleteFile: (id: string) => void
  deleteFolder: (id: string) => void
  activeFileId: string | null
  expandedFolderIds: string[]
}

function sortFiles(a: FileNode, b: FileNode) {
  if (a.isFolder && !b.isFolder) return -1
  if (!a.isFolder && b.isFolder) return 1
  return a.name.localeCompare(b.name)
}

function TreeNode(props: TreeNodeProps) {
  const {
    node, depth, files, isCreatingFile, isCreatingFolder,
    renamingId, cursorOn, setCursorOn, getNearestDir, renameRef, handleOpenFile,
    newFileName, setNewFileName, setRenamingId, handleRenameFile,
    handleRenameFileKeyDown, toggleRename, toggleCreateFile, handleCreateFile,
    handleCreateFileKeyDown, toggleCreateFolder, handleCreateFolder,
    handleCreateFolderKeyDown, deleteFile, deleteFolder, activeFileId, expandedFolderIds,
  } = props

  const paddingLeft = `${0.375 + depth / 2}rem`
  const childPaddingLeft = `${0.375 + (depth + 1) / 2}rem`
  const isExpanded = expandedFolderIds.includes(node.id)
  const isActive = node.id === activeFileId
  const isCursorOn = node.id === cursorOn

  return (
    <div>
      {/* Row */}
      <div
        onClick={(e) => { e.stopPropagation(); handleOpenFile(node) }}
        style={{ paddingLeft }}
        className={
          'group flex flex-row pr-1.5 py-0.5 h-7 gap-1 text-[12.5px] transition-all cursor-pointer ' +
          (isActive
            ? 'bg-file-active border-l-2 border-border-strong text-text-primary'
            : isCursorOn
              ? 'bg-file-hover border-l-2 border-border text-text-secondary'
              : 'border-l-2 border-l-transparent hover:bg-file-hover text-text-secondary')
        }
      >
        {renamingId === node.id ? (
          <div ref={renameRef} className='contents'>
            <FileNameInput
              value={newFileName}
              defaultValue={node.name}
              onChange={(e) => setNewFileName(e.target.value.trim())}
              onKeyDown={handleRenameFileKeyDown}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setRenamingId(null); setNewFileName('') }}
              className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'
            >
              <X className='size-em' />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleRenameFile() }}
              className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'
            >
              <Check className='size-em' />
            </button>
          </div>
        ) : (
          <>
            {node.isFolder && (
              <span className={`my-auto text-[9px] text-text-muted flex-shrink-0 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}>
                ▶
              </span>
            )}

            <div className='my-auto flex-1 truncate'>{node.name}</div>

            <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <button
                onClick={(e) => { e.stopPropagation(); toggleRename(node) }}
                className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'
              >
                <PenLine className='size-em' />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (node.isFolder) {
                    deleteFolder(node.id)
                  } else {
                    deleteFile(node.id)
                  }
                  setCursorOn(null)
                }}
                className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'
              >
                <Trash className='size-em' />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Create file input under this node */}
      {isCreatingFile && (cursorOn ? getNearestDir(cursorOn) : null) === node.id && (
        <div ref={renameRef} style={{ paddingLeft: childPaddingLeft }} className='flex flex-row text-[12.5px] pr-1.5 py-0.5 h-7 gap-1'>
          <FileNameInput value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleCreateFileKeyDown} />
          <button onClick={toggleCreateFile} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><X className='size-em' /></button>
          <button onClick={handleCreateFile} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><Plus className='size-em' /></button>
        </div>
      )}

      {/* Create folder input under this node */}
      {isCreatingFolder && (cursorOn ? getNearestDir(cursorOn) : null) === node.id && (
        <div ref={renameRef} style={{ paddingLeft: childPaddingLeft }} className='flex flex-row text-[12.5px] pr-1.5 py-0.5 h-7 gap-1'>
          <FileNameInput value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleCreateFolderKeyDown} />
          <button onClick={toggleCreateFolder} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><X className='size-em' /></button>
          <button onClick={handleCreateFolder} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><Plus className='size-em' /></button>
        </div>
      )}

      {/* Children */}
      {node.isFolder && isExpanded && (
        files
          .filter(f => f.parentId === node.id)
          .sort(sortFiles)
          .map(file => (
            <TreeNode key={file.id} {...props} node={file} depth={depth + 1} />
          ))
      )}
    </div>
  )
}

function Sidebar() {
  const {
    files, createFile, deleteFile, renameFile, openFile,
    toggleFolder, createFolder, renameFolder, deleteFolder,
    activeFileId, expandedFolderIds, getNearestDir
  } = useFilesStore()

  const [newFileName, setNewFileName] = useState<string>('')
  const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [cursorOn, setCursorOn] = useState<string | null>(null)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const renameRef = useClickOutside(() => {
    setRenamingId(null)
    setIsCreatingFile(false)
    setIsCreatingFolder(false)
    setNewFileName('')
  })

  const toggleCreateFile = () => {
    setRenamingId(null)
    setNewFileName('')
    setIsCreatingFolder(false)
    setIsCreatingFile(prev => !prev)
  }

  const toggleCreateFolder = () => {
    setRenamingId(null)
    setNewFileName('')
    setIsCreatingFile(false)
    setIsCreatingFolder(prev => !prev)
  }

  const toggleRename = (file: FileNode) => {
    if (renamingId !== file.id) {
      setIsCreatingFile(false)
      setIsCreatingFolder(false)
      setNewFileName(file.name)
      setRenamingId(file.id)
    } else {
      setRenamingId(null)
      setNewFileName('')
    }
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) createFile(newFileName.trim(), cursorOn)
    setIsCreatingFile(false)
    setNewFileName('')
  }

  const handleCreateFolder = () => {
    if (newFileName.trim()) createFolder(newFileName.trim(), cursorOn)
    setIsCreatingFolder(false)
    setNewFileName('')
  }

  const handleRenameFile = () => {
    if (newFileName.trim()) {
      const target = files.find(f => f.id === renamingId)
      if (target?.isFolder) renameFolder(renamingId!, newFileName.trim())
      else renameFile(renamingId!, newFileName.trim())
    }
    setRenamingId(null)
    setNewFileName('')
  }

  const handleOpenFile = (file: FileNode) => {
    setRenamingId(null)
    setIsCreatingFile(false)
    setCursorOn(file.id)
    if (file.isFolder) toggleFolder(file.id)
    else openFile(file.id)
  }

  const handleCreateFileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateFile()
    if (e.key === 'Escape') { setIsCreatingFile(false); setNewFileName('') }
  }

  const handleCreateFolderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateFolder()
    if (e.key === 'Escape') { setIsCreatingFolder(false); setNewFileName('') }
  }

  const handleRenameFileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameFile()
    if (e.key === 'Escape') { setRenamingId(null); setNewFileName('') }
  }

  // Clear cursorOn when clicking empty space inside sidebar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!sidebarRef.current?.contains(target)) return
      if (target.closest('button') || target.closest('input')) return
      setCursorOn(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const sharedProps = {
    files, isCreatingFile, isCreatingFolder, renamingId,
    cursorOn, setCursorOn, getNearestDir, renameRef, handleOpenFile,
    newFileName, setNewFileName, setRenamingId, handleRenameFile,
    handleRenameFileKeyDown, toggleRename, toggleCreateFile, handleCreateFile,
    handleCreateFileKeyDown, toggleCreateFolder, handleCreateFolder,
    handleCreateFolderKeyDown, deleteFile, deleteFolder, activeFileId,
    expandedFolderIds,
  }

  return (
    <div className='w-48 h-full flex flex-col bg-sidebar border-r border-border divide-y divide-border z-20' style={{ boxShadow: 'var(--shadow-sidebar)' }}>

      {/* Header */}
      <div className='flex items-center justify-between px-3 py-2'>
        <span className='text-xs text-text-muted uppercase font-semibold tracking-wider'>Explorer</span>
        <div className='flex gap-1'>
          <button onClick={toggleCreateFolder} className='p-1.5 rounded-md hover:bg-file-active text-text-muted hover:text-text-primary transition-all' title='New Folder'>
            <FolderPlus className='size-3.5' />
          </button>
          <button onClick={toggleCreateFile} className='p-1.5 rounded-md hover:bg-file-active text-text-muted hover:text-text-primary transition-all' title='New File'>
            <FilePlus className='size-3.5' />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className='flex-1 overflow-y-auto pt-1' ref={sidebarRef}>

        {/* Root-level create inputs */}
        {isCreatingFile && (cursorOn ? getNearestDir(cursorOn) : null) === null && (
          <div ref={renameRef} className='flex flex-row text-[12.5px] px-1.5 py-0.5 h-7 gap-1'>
            <FileNameInput value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleCreateFileKeyDown} />
            <button onClick={toggleCreateFile} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><X className='size-em' /></button>
            <button onClick={handleCreateFile} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><Plus className='size-em' /></button>
          </div>
        )}
        {isCreatingFolder && (cursorOn ? getNearestDir(cursorOn) : null) === null && (
          <div ref={renameRef} className='flex flex-row text-[12.5px] px-1.5 py-0.5 h-7 gap-1'>
            <FileNameInput value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} onKeyDown={handleCreateFolderKeyDown} />
            <button onClick={toggleCreateFolder} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><X className='size-em' /></button>
            <button onClick={handleCreateFolder} className='hover:bg-file-active my-auto p-1 rounded-md aspect-square text-xs transition-all'><Plus className='size-em' /></button>
          </div>
        )}

        {/* Root nodes */}
        {files
          .filter(f => f.parentId === null)
          .sort(sortFiles)
          .map(file => (
            <TreeNode key={file.id} {...sharedProps} node={file} depth={0} />
          ))
        }
      </div>
    </div>
  )
}

export { Sidebar }
