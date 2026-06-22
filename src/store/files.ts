import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FileNode } from '../types'

interface FilesState {
  files: FileNode[];
  activeFileId: string | null;

  createFile: (name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  setActive: (id: string | null) => void;
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

      setActive: (id) => set({ activeFileId: id }),

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
        set((state) => ({ files: [...state.files, newFile], activeFileId: newFile.id }));
      },
      updateFileContent: (id: string, content: string) => {
        set((state) => ({
          files: state.files.map(file => file.id === id ? { ...file, content } : file)
        }))
      },
      deleteFile: (id: string) => {
        set((state) => {
          const index = state.files.findIndex((file: FileNode) => file.id === id);
          const remaining = state.files.filter((file: FileNode) => file.id !== id);
          return {
            files: remaining,
            activeFileId: state.activeFileId === id ? (remaining[index - 1]?.id ?? remaining[0]?.id ?? null) : state.activeFileId
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