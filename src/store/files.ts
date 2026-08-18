import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FileNode, CursorPosition } from '../types'

interface FilesState {
  files: FileNode[];
  activeFileId: string | null;
  openFileIds: string[];
  expandedFolderIds: string[];

  createFile: (name: string, parentId: string | null) => void;
  updateFileContent: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  createFolder: (name: string, parentId: string | null) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;
  toggleFolder: (id: string) => void;
  updateCursorPosition: (id: string, position: CursorPosition) => void;
  getNearestDir: (id: string) => string | null;
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
      expandedFolderIds: [],

      openFile: (id: string) => {
        set((state) => ({ openFileIds: (state.openFileIds.includes(id) ? state.openFileIds : [...state.openFileIds, id]), activeFileId: id }));
      },
      closeFile: (id: string) => {
        set((state) => {
          const remaining = state.openFileIds.filter((fileId: string) => fileId !== id);
          const currentIndex = state.openFileIds.findIndex((fileId: string) => fileId === id);

          if (state.activeFileId !== id) {
            return { openFileIds: remaining };
          }

          const previous = state.openFileIds.slice(0, currentIndex).reverse().find((fileId) => fileId !== id);
          const next = state.openFileIds.slice(currentIndex + 1).find((fileId) => fileId !== id);

          return {
            openFileIds: remaining,
            activeFileId: previous ?? next ?? remaining[0] ?? null,
          };
        })
      },
      activeFile: () => {
        const { files, activeFileId } = get();
        return files.find(file => file.id === activeFileId) || null;
      },

      createFile: (name: string, parentId: string | null) => {
        const { files } = get();
        const existingFile = files.find((file) => file.name === name && file.parentId === parentId);

        if (existingFile) {
          set((state) => ({
            activeFileId: existingFile.id,
            openFileIds: state.openFileIds.includes(existingFile.id)
              ? state.openFileIds
              : [...state.openFileIds, existingFile.id]
          }));
          return;
        }

        const newFile: FileNode = {
          id: crypto.randomUUID(),
          name,
          language: detectLanguage(name),
          content: '',
          createdAt: Date.now(),
          cursorPosition: { line: 1, column: 1 },
          parentId,
          isFolder: false,
        };
        set((state) => ({ files: [...state.files, newFile], activeFileId: newFile.id, openFileIds: [...state.openFileIds, newFile.id] }));
      },
      updateFileContent: (id: string, content: string) => {
        set((state) => ({
          files: state.files.map(file => (file.id === id && !file.isFolder) ? { ...file, content } : file)
        }))
      },
      deleteFile: (id: string) => {
        set((state) => {
          const remainingOpen = state.openFileIds.filter((fileId: string) => fileId !== id);
          const currentIndex = state.openFileIds.findIndex((fileId: string) => fileId === id);
          const remaining = state.files.filter((file) => file.id !== id);

          if (state.activeFileId !== id) {
            return {
              files: remaining,
              openFileIds: remainingOpen,
            };
          }

          const previous = state.openFileIds.slice(0, currentIndex).reverse().find((fileId) => fileId !== id);
          const next = state.openFileIds.slice(currentIndex + 1).find((fileId) => fileId !== id);

          return {
            files: remaining,
            openFileIds: remainingOpen,
            activeFileId: previous ?? next ?? remainingOpen[0] ?? null,
          }
        })
      },
      renameFile: (id: string, newName: string) => {
        set((state) => ({
          files: state.files.map(file => (file.id === id && !file.isFolder) ? { ...file, name: newName, language: detectLanguage(newName) } : file)
        }))
      },
      createFolder: (name: string, parentId: string | null) => {
        const { files } = get();
        const existingFolder = files.find((file) => file.name === name && file.isFolder && file.parentId === parentId);

        if (existingFolder) {
          set((state) => ({
            expandedFolderIds: state.expandedFolderIds.includes(existingFolder.id) ? state.expandedFolderIds : [...state.expandedFolderIds, existingFolder.id]
          }))
          return;
        }

        const newFolder: FileNode = {
          id: crypto.randomUUID(),
          name,
          language: '',
          content: '',
          createdAt: Date.now(),
          cursorPosition: { line: 1, column: 1 },
          parentId,
          isFolder: true,
        }
        set((state) => ({
          files: [...state.files, newFolder]
        }))
      },
      deleteFolder: (id: string) => {
        set((state) => {
          const getAllDescendantIds = (parentId: string): string[] => {
            const children = state.files.filter(f => f.parentId === parentId)
            return [
              parentId,
              ...children.flatMap(c =>
                c.isFolder ? getAllDescendantIds(c.id) : [c.id]
              )
            ]
          }

          const idsToDelete = new Set(getAllDescendantIds(id))
          const remainingOpen = state.openFileIds.filter(fId => !idsToDelete.has(fId))

          if (!idsToDelete.has(state.activeFileId ?? '')) {
            return {
              files: state.files.filter(f => !idsToDelete.has(f.id)),
              openFileIds: remainingOpen,
              activeFileId: state.activeFileId,
              expandedFolderIds: state.expandedFolderIds.filter(fId => !idsToDelete.has(fId))
            }
          }

          const deletedIndex = state.openFileIds.findIndex(fId => idsToDelete.has(fId))
          const previous = state.openFileIds.slice(0, deletedIndex).reverse().find(fId => !idsToDelete.has(fId))
          const next = state.openFileIds.slice(deletedIndex + 1).find(fId => !idsToDelete.has(fId))

          return {
            files: state.files.filter(f => !idsToDelete.has(f.id)),
            openFileIds: remainingOpen,
            activeFileId: previous ?? next ?? remainingOpen[0] ?? null,
            expandedFolderIds: state.expandedFolderIds.filter(fId => !idsToDelete.has(fId))
          }
        })
      },
      renameFolder: (id: string, newName: string) => {
        set((state) => ({
          files: state.files.map((file) => (file.id === id && file.isFolder) ? { ...file, name: newName } : file)
        }))
      },
      toggleFolder: (id: string) => {
        set((state) => ({
          expandedFolderIds: state.expandedFolderIds.includes(id) ? state.expandedFolderIds.filter((folderId) => folderId !== id) : [...state.expandedFolderIds, id]
        }))
      },
      getNearestDir: (id: string) => {
        const { files } = get();

        const curr = files.find(file => file.id === id);
        if (!curr) return null;

        if (curr.isFolder) return curr.id;
        return curr.parentId;
      },
      updateCursorPosition: (id: string, position: CursorPosition) => {
        set((state) => ({
          files: state.files.map(file => file.id === id ? { ...file, cursorPosition: position} : file)
        }))
      }
    }),
    { name: 'coolab-files' }
  )
)
