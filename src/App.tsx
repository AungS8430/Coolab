import { useFilesStore } from './store/files';

import { Editor } from './components/Editor';
import { Sidebar } from './components/Sidebar';
import { Tabs } from './components/Tabs';
import { StatusBar } from './components/StatusBar';
import { Empty } from './components/Empty';

function App() {
  const { activeFile, updateFileContent, updateCursorPosition } = useFilesStore();

  const file = activeFile();
  return (
    <div className='flex h-screen w-screen overflow-hidden bg-floor text-primary'>
      <Sidebar />
      <div className='flex-1 flex flex-col divide-y divide-border overflow-hidden'>
        <Tabs />
        <div className='flex-1 overflow-hidden'>
          {
            file ? (
              <Editor
                key={file.id}
                value={file.content}
                language={file.language}
                theme='vs-dark'
                onChange={(value) => updateFileContent(file.id, value)}
                onCursorMove={(position) => updateCursorPosition(file.id, position)}
              />
            ) : (
              <Empty />
            )
          }
        </div>

        { file && <StatusBar /> }
      </div>
    </div>
  )
}

export default App;
