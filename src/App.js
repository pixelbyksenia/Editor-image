import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ImageEditor from './components/ImageEditor/ImageEditor';
import Logo from './components/ImageEditor/Logo/Logo';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9370DB',
    },
  },
});

function App() {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ThemeProvider theme={theme}>
        <ImageEditor />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <div className="App-logo-wrapper">
            <Logo />
          </div>
          <p className="App-description">
            Editor - инструмент для редактирования изображений
          </p>
          <button
            className="App-link"
            onClick={() => setIsEditing(true)}
          >
            Начать редактирование
          </button>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
