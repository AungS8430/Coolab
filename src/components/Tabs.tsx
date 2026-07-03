import { X } from 'lucide-react';
import { useFilesStore } from '../store/files';

function Tabs() {
  const { files, openFileIds, openFile, closeFile, activeFileId } = useFilesStore()
  return (
    <div className='bg-tabbar border-b border-border flex flex-row overflow-y-scroll px-1 pt-1'>
      {
        openFileIds.map((id: string) => {
          const file = files.find((f) => f.id === id);
          if (!file) return null

          return (
            <div key={id} onClick={() => openFile(id)} className={'group w-fit min-w-32 max-w-52 rounded-t-md text-[12.5px] h-10 px-3 gap-3 hover:bg-file-hover flex justify-between ' + (file.id === activeFileId ? 'bg-tab-active text-primary border-t-2 border-border-strong' : 'text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-secondary rounded-t-lg border border-transparent')}>
              <div className='my-auto truncate'>{file.name}</div>
              <button onClick={(e) => {e.stopPropagation(); closeFile(id)}} className='hidden group-hover:block my-auto p-1 hover:bg-secondary/50 rounded-md transition-all'><X className='size-em' /></button>
            </div>
          )
        })
      }
    </div>
  )
}

export { Tabs };
