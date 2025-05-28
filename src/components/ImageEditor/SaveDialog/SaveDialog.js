import React from 'react';
import {
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
  Typography,
  Box
} from '@mui/material';
import './SaveDialog.css';

const SaveDialog = ({ open, onClose, onSave, settings, onSettingsChange }) => {
  const handleSettingsChange = (field) => (event) => {
    onSettingsChange({
      ...settings,
      [field]: event.target.value
    });
  };

  const handleQualityChange = (event, newValue) => {
    onSettingsChange({
      ...settings,
      quality: newValue
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      className="save-dialog"
    >
      <DialogTitle>Сохранить изображение</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 2 }}>
          <TextField
            label="Имя файла"
            value={settings.fileName}
            onChange={handleSettingsChange('fileName')}
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Формат</InputLabel>
            <Select
              value={settings.format}
              onChange={handleSettingsChange('format')}
              label="Формат"
            >
              <MenuItem value="png">PNG</MenuItem>
              <MenuItem value="jpeg">JPEG</MenuItem>
            </Select>
          </FormControl>
          {settings.format === 'jpeg' && (
            <Box>
              <Typography gutterBottom>
                Качество: {Math.round(settings.quality * 100)}%
              </Typography>
              <Slider
                value={settings.quality}
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
          onClick={onClose}
          sx={{ color: '#483D8B' }}
        >
          Отмена
        </Button>
        <Button 
          onClick={onSave}
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
  );
};

export default SaveDialog; 