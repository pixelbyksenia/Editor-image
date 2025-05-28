import React from 'react';
import { 
  Box, 
  Slider, 
  Typography,
  IconButton,
  Popover,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import CreateIcon from '@mui/icons-material/Create';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import OpacityIcon from '@mui/icons-material/Opacity';
import './BrushSettings.css';

const PRESET_COLORS = [
  '#483D8B', '#9370DB', '#DDA0DD', '#E6E6FA', // Основные цвета нашей темы
  '#000000', '#FF0000', '#00FF00', '#0000FF', // Базовые цвета
  '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF', // Дополнительные цвета
];

const BRUSH_TYPES = [
  { id: 'pencil', icon: <CreateIcon />, label: 'Карандаш' },
  { id: 'brush', icon: <BrushIcon />, label: 'Кисть' },
  { id: 'marker', icon: <FormatPaintIcon />, label: 'Маркер' },
  { id: 'airbrush', icon: <AutoFixNormalIcon />, label: 'Аэрограф' },
  { id: 'eraser', icon: <LayersClearIcon />, label: 'Ластик' },
];

const BrushSettings = ({ 
  brushSize, 
  brushColor, 
  brushType,
  opacity,
  onBrushSizeChange, 
  onBrushColorChange,
  onBrushTypeChange,
  onOpacityChange
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isEraser = brushType === 'eraser';

  const handleColorClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (color) => {
    onBrushColorChange(color);
    handleColorClose();
  };

  const handleBrushTypeChange = (_, newType) => {
    if (newType !== null) {
      onBrushTypeChange(newType);
    }
  };

  return (
    <Box className="brush-settings">
      <Box className="brush-types">
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#483D8B' }}>
          Инструменты
        </Typography>
        <ToggleButtonGroup
          value={brushType}
          exclusive
          onChange={handleBrushTypeChange}
          orientation="vertical"
          className="brush-type-group"
        >
          {BRUSH_TYPES.map((type) => (
            <ToggleButton 
              key={type.id} 
              value={type.id}
              className="brush-type-button"
            >
              {type.icon}
              <Typography variant="body2">
                {type.label}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box className="brush-size-control">
        <Box className="control-header">
          <BrushIcon />
          <Typography>
            {isEraser ? "Размер ластика" : "Размер кисти"}
          </Typography>
        </Box>
        <Slider
          value={brushSize}
          onChange={(_, value) => onBrushSizeChange(value)}
          min={1}
          max={50}
          step={1}
          valueLabelDisplay="auto"
          sx={{
            color: isEraser ? '#666' : brushColor
          }}
        />
        <Typography variant="caption" sx={{ alignSelf: 'flex-end' }}>
          {brushSize}px
        </Typography>
      </Box>

      {!isEraser && (
        <>
          <Box className="opacity-control">
            <Box className="control-header">
              <OpacityIcon />
              <Typography>
                Непрозрачность
              </Typography>
            </Box>
            <Slider
              value={opacity}
              onChange={(_, value) => onOpacityChange(value)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              sx={{
                color: brushColor
              }}
            />
            <Typography variant="caption" sx={{ alignSelf: 'flex-end' }}>
              {opacity}%
            </Typography>
          </Box>

          <Box className="color-picker">
            <Box className="control-header">
              <ColorLensIcon />
              <Typography>
                Цвет
              </Typography>
            </Box>
            <Paper className="color-palette">
              <Box className="color-grid">
                {PRESET_COLORS.map((color) => (
                  <Tooltip key={color} title={color} placement="top">
                    <Box
                      className="color-option"
                      sx={{
                        backgroundColor: color,
                        opacity: opacity / 100,
                        border: color === brushColor ? '2px solid #483D8B' : '2px solid transparent'
                      }}
                      onClick={() => handleColorSelect(color)}
                    />
                  </Tooltip>
                ))}
              </Box>
              <Box className="custom-color">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  title="Выбрать произвольный цвет"
                />
              </Box>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default BrushSettings; 