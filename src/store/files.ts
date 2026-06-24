import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FileNode } from '../types'

interface FilesState {
  files: FileNode[];
  activeFileId: string | null;
  openFileIds: string[];

  createFile: (name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  activeFile: () => FileNode | null;
}

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'py': return 'python';
    case 'java': return 'java';
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'c': return 'cpp';
    case 'cs': return 'csharp';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'plaintext';
  }
}

export const useFilesStore = create<FilesState>()(
  persist(
    (set, get) => ({
      files: [],
      activeFileId: null,
      openFileIds: [],

      openFile: (id: string) => {
        set((state) => ({ openFileIds: (state.openFileIds.includes(id) ? state.openFileIds : [...state.openFileIds, id]), activeFileId: id }));
      },
      closeFile: (id: string) => {
        set((state) => {
          const index = state.openFileIds.findIndex((fileId: string) => fileId === id);
          const remaining = state.openFileIds.filter((fileId: string) => fileId !== id);
          return {
            openFileIds: remaining,
            activeFileId: state.activeFileId === id ? (remaining[index - 1] ?? remaining[0] ?? null) : state.activeFileId
          }
        })
      },
      activeFile: () => {
        const { files, activeFileId } = get();
        return files.find(file => file.id === activeFileId) || null;
      },

      createFile: (name: string) => {
        const newFile: FileNode = {
          id: crypto.randomUUID(),
          name,
          language: detectLanguage(name),
          content: '',
          createdAt: Date.now()
        };
        set((state) => ({ files: [...state.files, newFile], activeFileId: newFile.id, openFileIds: [...state.openFileIds, newFile.id] }));
      },
      updateFileContent: (id: string, content: string) => {
        set((state) => ({
          files: state.files.map(file => file.id === id ? { ...file, content } : file)
        }))
      },
      deleteFile: (id: string) => {
        set((state) => {
          const index = state.openFileIds.findIndex((fileId: string) => fileId === id);
          const remainingOpen = state.openFileIds.filter((fileId: string) => fileId !== id);
          const remaining = state.files.filter((file) => file.id !== id);
          return {
            files: remaining,
            openFileIds: remainingOpen,
            activeFileId: state.activeFileId === id ? (remainingOpen[index - 1] ?? remainingOpen[0] ?? null) : state.activeFileId
          }
        })
      },
      renameFile: (id: string, newName: string) => {
        set((state) => ({
          files: state.files.map(file => file.id === id ? { ...file, name: newName, language: detectLanguage(newName) } : file)
        }))
      }
    }),
    { name: 'coolab-files' }
  )
)
