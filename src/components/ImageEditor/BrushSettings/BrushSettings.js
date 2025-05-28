import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Slider,
  Typography,
  ClickAwayListener,
  useMediaQuery
} from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import CreateIcon from '@mui/icons-material/Create';
import GestureIcon from '@mui/icons-material/Gesture';
import OpacityIcon from '@mui/icons-material/Opacity';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import TuneIcon from '@mui/icons-material/Tune';
import './BrushSettings.css';

const PRESET_COLORS = [
  '#483D8B', '#9370DB', '#DDA0DD', '#E6E6FA', // Основные цвета нашей темы
  '#000000', '#FF0000', '#00FF00', '#0000FF', // Базовые цвета
  '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF', // Дополнительные цвета
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
  const [isVisible, setIsVisible] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 360px)');

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const brushTypes = [
    { type: 'pencil', label: 'Карандаш', icon: <CreateIcon /> },
    { type: 'brush', label: 'Кисть', icon: <BrushIcon /> },
    { type: 'marker', label: 'Маркер', icon: <GestureIcon /> },
    { type: 'airbrush', label: 'Спрей', icon: <OpacityIcon /> },
    { type: 'eraser', label: 'Ластик', icon: <FormatPaintIcon /> }
  ];

  const handleBrushTypeClick = (type) => {
    onBrushTypeChange(type);
    if (isSmallScreen) {
      setIsVisible(false); // Закрываем панель после выбора на маленьких экранах
    }
  };

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  const handleClickAway = () => {
    if (isMobile) {
      setIsVisible(false);
    }
  };

  // Вычисляем максимальную высоту панели
  const maxPanelHeight = Math.min(500, windowHeight * 0.8);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <button className="mobile-toggle" onClick={togglePanel}>
          <TuneIcon />
        </button>

        <Box 
          className={`brush-settings ${isVisible ? 'visible' : ''}`}
          sx={{
            ...(isMobile && {
              maxHeight: `${maxPanelHeight}px`,
              overflowY: 'auto',
              overscrollBehavior: 'contain'
            })
          }}
        >
          <div className="settings-group">
            <Typography variant="h6">Инструменты</Typography>
            <div className="brush-type-buttons">
              {brushTypes.map(({ type, label, icon }) => (
                <Button
                  key={type}
                  className={`brush-type-button ${brushType === type ? 'active' : ''}`}
                  onClick={() => handleBrushTypeClick(type)}
                  startIcon={icon}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="settings-group">
            <Typography variant="h6">Размер</Typography>
            <Slider
              value={brushSize}
              onChange={(_, value) => onBrushSizeChange(value)}
              min={1}
              max={50}
              valueLabelDisplay="auto"
              sx={{
                color: '#9370DB',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#483D8B',
                }
              }}
            />
          </div>

          {brushType !== 'eraser' && (
            <>
              <div className="settings-group">
                <Typography variant="h6">Цвет</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ColorLensIcon sx={{ color: brushColor }} />
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => onBrushColorChange(e.target.value)}
                    style={{
                      width: '100%',
                      height: isMobile ? '50px' : '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </Box>
              </div>

              <div className="settings-group">
                <Typography variant="h6">Прозрачность</Typography>
                <Slider
                  value={opacity}
                  onChange={(_, value) => onOpacityChange(value)}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#9370DB',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#483D8B',
                    }
                  }}
                />
              </div>
            </>
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default BrushSettings; 