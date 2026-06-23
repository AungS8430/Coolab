import { useState } from 'react';
import { useFilesStore } from '../store/files';
import type { FileNode } from '../types';

function FileNameInput({ value, defaultValue, onChange }: { value: string, defaultValue?: string, onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <input type='text' value={value} onChange={onChange} defaultValue={defaultValue} />
  )
}

function Sidebar() {
  const { files, activeFileId, createFile, updateFileContent, deleteFile, renameFile, setActive, activeFile } = useFilesStore();
  const [newFileName, setNewFileName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const toggleCreate = () => {
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

  return (
    <div>
      <div>
        { isCreating &&
          <div>
            <FileNameInput value={newFileName} onChange={(e) => setNewFileName(e.target.value.trim())} />
            <button onClick={handleCreateFile}>Create</button>
          </div>
        }
        <button onClick={toggleCreate}>
          Create File
        </button>
      </div>
      <div>
        {
          files.map((file) => {
            return (
              <div key={file.id}>
                {
                  renamingId === file.id ? (
                    <>
                      <FileNameInput value={newFileName} defaultValue={file.name} onChange={(e) => setNewFileName(e.target.value.trim())} />
                      <button onClick={handleRenameFile}>rename</button>
                    </>
                  ) : (
                    <>
                      <div onClick={() => setActive(file.id)}>{file.name}</div>
                      <button onClick={() => toggleRename(file)}>rename file</button>
                      <button onClick={() => deleteFile(file.id)}>delete file</button>
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
