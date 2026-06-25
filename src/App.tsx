import { useFilesStore } from './store/files';

import { Editor } from './components/Editor';
import { Sidebar } from './components/Sidebar';
import { Tabs } from './components/Tabs';
import { StatusBar } from './components/StatusBar';

function App() {
  const { activeFile, updateFileContent, updateCursorPosition } = useFilesStore();

  const file = activeFile();
  return (
    <div className="App">
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
          <div>No file opened</div>
        )
      }
      <Sidebar />
      <Tabs />
      <StatusBar />
    </div>
  )
}

export default App;
