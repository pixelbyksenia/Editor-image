import React, { useState, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Tooltip,
  IconButton
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Canvas from './Canvas/Canvas';
import SaveDialog from './SaveDialog/SaveDialog';
import BrushSettings from './BrushSettings/BrushSettings';
import ImageUpload from './ImageUpload/ImageUpload';
import Logo from './Logo/Logo';
import './ImageEditor.css';

const ImageEditor = () => {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [saveSettings, setSaveSettings] = useState({
    fileName: 'my-drawing',
    format: 'png',
    quality: 0.92
  });
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const canvasRef = useRef(null);
  
  // История состояний
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // Настройки кисти
  const [brushSize, setBrushSize] = useState(2);
  const [brushColor, setBrushColor] = useState('#483D8B');
  const [brushType, setBrushType] = useState('pencil');
  const [opacity, setOpacity] = useState(100);

  const handleHistoryUpdate = (state) => {
    const newHistory = [...history.slice(0, currentStep + 1), state];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      canvasRef.current?.loadState(history[currentStep - 1]);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      canvasRef.current?.loadState(history[currentStep + 1]);
    }
  };

  const handleSave = () => {
    if (!currentCanvas) return;
    
    const link = document.createElement('a');
    const imageData = currentCanvas.toDataURL(
      `image/${saveSettings.format}`, 
      saveSettings.format === 'jpeg' ? saveSettings.quality : undefined
    );
    link.download = `${saveSettings.fileName}.${saveSettings.format}`;
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpenSaveDialog(false);
  };

  const handleClearCanvas = () => {
    if (window.confirm('Вы уверены, что хотите очистить холст? Это действие нельзя отменить.')) {
      canvasRef.current?.clearCanvas();
    }
  };

  const handleImageLoad = (file) => {
    canvasRef.current?.loadImage(file);
  };

  const renderToolbarButton = (title, icon, onClick, disabled = false, color = '#483D8B') => (
    <Tooltip title={title} placement="top">
      <span>
        <IconButton 
          onClick={onClick}
          disabled={disabled}
          size="small"
          sx={{ 
            color,
            '&:hover': { 
              backgroundColor: `${color}1A` // 10% opacity
            },
            '&:disabled': {
              color: `${color}80` // 50% opacity
            }
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Box className="editor-container">
      <Box className="editor-layout">
        <Box className="editor-main">
          <Logo />
          <Paper elevation={3} className="canvas-container">
            <Box className="editor-toolbar">
              {/* Файловые операции */}
              <Box className="toolbar-group file-controls">
                <ImageUpload 
                  onImageLoad={handleImageLoad}
                  icon={<FileUploadIcon />}
                  color="#483D8B"
                />
                {renderToolbarButton(
                  "Сохранить изображение",
                  <SaveIcon />,
                  () => setOpenSaveDialog(true)
                )}
              </Box>

              <div className="toolbar-divider" />

              {/* История действий */}
              <Box className="toolbar-group history-controls">
                {renderToolbarButton(
                  "Отменить (Ctrl+Z)",
                  <UndoIcon />,
                  handleUndo,
                  currentStep <= 0
                )}
                {renderToolbarButton(
                  "Повторить (Ctrl+Y)",
                  <RedoIcon />,
                  handleRedo,
                  currentStep >= history.length - 1
                )}
              </Box>

              <div className="toolbar-divider" />

              {/* Очистка холста */}
              <Box className="toolbar-group clear-controls">
                {renderToolbarButton(
                  "Очистить холст",
                  <DeleteOutlineIcon />,
                  handleClearCanvas,
                  false,
                  '#ff4444'
                )}
              </Box>
            </Box>

            <Canvas 
              ref={canvasRef}
              onDraw={setCurrentCanvas}
              onHistoryUpdate={handleHistoryUpdate}
              brushSize={brushSize}
              brushColor={brushColor}
              brushType={brushType}
              opacity={opacity}
            />
          </Paper>
        </Box>

        {/* Боковая панель с настройками кисти */}
        <BrushSettings
          brushSize={brushSize}
          brushColor={brushColor}
          brushType={brushType}
          opacity={opacity}
          onBrushSizeChange={setBrushSize}
          onBrushColorChange={setBrushColor}
          onBrushTypeChange={setBrushType}
          onOpacityChange={setOpacity}
        />
      </Box>

      <SaveDialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        onSave={handleSave}
        settings={saveSettings}
        onSettingsChange={setSaveSettings}
      />
    </Box>
  );
};

export default ImageEditor; 