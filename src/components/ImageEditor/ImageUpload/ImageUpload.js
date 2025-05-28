import React, { useRef } from 'react';
import { 
  IconButton, 
  Tooltip,
  Box
} from '@mui/material';
import './ImageUpload.css';

const ImageUpload = ({ onImageLoad, icon, color = '#4CAF50' }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    onImageLoad(file);
    
    // Очищаем input для возможности повторной загрузки того же файла
    event.target.value = '';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    onImageLoad(file);
  };

  return (
    <Box 
      className="image-upload"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Tooltip title="Загрузить изображение" placement="top">
        <IconButton 
          onClick={handleClick}
          size="small"
          sx={{ 
            color,
            '&:hover': { 
              backgroundColor: `${color}1A` // 10% opacity
            } 
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ImageUpload; 