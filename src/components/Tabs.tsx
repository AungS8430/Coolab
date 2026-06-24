import { useFilesStore } from '../store/files';

function Tabs() {
  const { files, openFileIds, openFile, closeFile, activeFileId } = useFilesStore()
  return (
    <div>
      {
        openFileIds.map((id: string) => {
          const file = files.find((f) => f.id === id);
          if (!file) return null

          return (
            <div key={id} className={file.id === activeFileId ? 'active-file' : undefined}>
              <div onClick={() => openFile(id)}>{file.name}</div>
              <button onClick={() => closeFile(id)}>close</button>
            </div>
          )
        })
      }
    </div>
  )
}

export { Tabs };
