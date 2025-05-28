import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Slider,
  Typography
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import './ImageEditor.css';

const ImageEditor = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const canvasRef = useRef(null);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [saveSettings, setSaveSettings] = useState({
    fileName: 'my-drawing',
    format: 'png',
    quality: 0.92
  });

  // Инициализация canvas с белым фоном
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Заполняем canvas белым цветом
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
    setIsDrawing(true);
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#483D8B';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSaveSettingsChange = (field) => (event) => {
    setSaveSettings({
      ...saveSettings,
      [field]: event.target.value
    });
  };

  const handleQualityChange = (event, newValue) => {
    setSaveSettings({
      ...saveSettings,
      quality: newValue
    });
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    const imageData = canvas.toDataURL(
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

  return (
    <Box className="editor-container">
      <Paper elevation={3} className="canvas-container">
        <Box className="toolbar">
          <IconButton sx={{ color: '#483D8B' }}>
            <UndoIcon />
          </IconButton>
          <IconButton sx={{ color: '#483D8B' }}>
            <RedoIcon />
          </IconButton>
          <IconButton 
            sx={{ color: '#483D8B' }}
            onClick={() => setOpenSaveDialog(true)}
            title="Сохранить изображение"
          >
            <SaveIcon />
          </IconButton>
        </Box>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="drawing-canvas"
        />
      </Paper>

      <Dialog 
        open={openSaveDialog} 
        onClose={() => setOpenSaveDialog(false)}
        className="save-dialog"
      >
        <DialogTitle>Сохранить изображение</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 2 }}>
            <TextField
              label="Имя файла"
              value={saveSettings.fileName}
              onChange={handleSaveSettingsChange('fileName')}
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Формат</InputLabel>
              <Select
                value={saveSettings.format}
                onChange={handleSaveSettingsChange('format')}
                label="Формат"
              >
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
              </Select>
            </FormControl>
            {saveSettings.format === 'jpeg' && (
              <Box>
                <Typography gutterBottom>
                  Качество: {Math.round(saveSettings.quality * 100)}%
                </Typography>
                <Slider
                  value={saveSettings.quality}
                  onChange={handleQualityChange}
                  min={0.1}
                  max={1}
                  step={0.01}
                  marks={[
                    { value: 0.1, label: '10%' },
                    { value: 1, label: '100%' }
                  ]}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenSaveDialog(false)}
            sx={{ color: '#483D8B' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={saveImage}
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #E6E6FA 0%, #DDA0DD 100%)',
              color: '#483D8B',
              '&:hover': {
                background: 'linear-gradient(45deg, #DDA0DD 0%, #9370DB 100%)',
                color: 'white'
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageEditor; 