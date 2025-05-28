import React, { useEffect, useRef, useCallback } from 'react';
import './Canvas.css';

const Canvas = ({ onDraw, onHistoryUpdate, brushSize, brushColor, brushType, opacity }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [lastX, setLastX] = React.useState(0);
  const [lastY, setLastY] = React.useState(0);

  // Инициализация canvas и контекста
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.scale(1, 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Заполняем холст белым цветом
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = ctx;
    saveState();
  }, []);

  // Обновляем настройки кисти
  useEffect(() => {
    if (!contextRef.current) return;
    
    const ctx = contextRef.current;
    const alpha = opacity / 100;

    if (brushType === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(255,255,255,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      const color = brushColor.startsWith('#') 
        ? hexToRgba(brushColor, alpha)
        : brushColor;
      ctx.strokeStyle = color;
    }

    // Настройки для разных типов кистей
    switch (brushType) {
      case 'pencil':
        ctx.lineWidth = brushSize;
        ctx.shadowBlur = 0;
        break;
      case 'brush':
        ctx.lineWidth = brushSize;
        ctx.shadowBlur = brushSize / 4;
        ctx.shadowColor = ctx.strokeStyle;
        break;
      case 'marker':
        ctx.lineWidth = brushSize;
        ctx.shadowBlur = 0;
        if (!brushType === 'eraser') {
          ctx.globalAlpha = 0.6;
        }
        break;
      case 'airbrush':
        ctx.lineWidth = 1;
        ctx.shadowBlur = brushSize * 2;
        ctx.shadowColor = ctx.strokeStyle;
        break;
      default:
        ctx.lineWidth = brushSize;
        ctx.shadowBlur = 0;
    }
  }, [brushType, brushSize, brushColor, opacity]);

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && onHistoryUpdate) {
      onHistoryUpdate(canvas.toDataURL());
    }
  }, [onHistoryUpdate]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    
    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    if (brushType === 'airbrush') {
      spray(coords.x, coords.y);
    }
    
    setIsDrawing(true);
    setLastX(coords.x);
    setLastY(coords.y);
  };

  const spray = (x, y) => {
    const ctx = contextRef.current;
    const density = brushSize * 2;
    
    for (let i = 0; i < density; i++) {
      const offsetX = getRandomOffset(brushSize);
      const offsetY = getRandomOffset(brushSize);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  };

  const getRandomOffset = (radius) => {
    const r = radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    return r * Math.cos(theta);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const coords = getCoordinates(e);
    const ctx = contextRef.current;
    
    if (brushType === 'airbrush') {
      spray(coords.x, coords.y);
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
    
    setLastX(coords.x);
    setLastY(coords.y);
    
    if (onDraw) onDraw(canvasRef.current);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      // Сбрасываем globalAlpha для marker
      if (brushType === 'marker') {
        contextRef.current.globalAlpha = 1;
      }
      setIsDrawing(false);
      saveState();
    }
  };

  const loadState = (state) => {
    const img = new Image();
    img.onload = () => {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      contextRef.current.drawImage(img, 0, 0);
      if (onDraw) onDraw(canvasRef.current);
    };
    img.src = state;
  };

  const clearCanvas = () => {
    const ctx = contextRef.current;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (onDraw) onDraw(canvasRef.current);
    saveState();
  };

  const loadImage = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        
        // Очищаем холст
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Вычисляем размеры для сохранения пропорций
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        // Рисуем изображение
        ctx.drawImage(
          img,
          x,
          y,
          img.width * scale,
          img.height * scale
        );
        
        if (onDraw) onDraw(canvas);
        saveState();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  React.useImperativeHandle(ref, () => ({
    loadState,
    clearCanvas,
    loadImage
  }));

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onMouseLeave={stopDrawing}
      className="drawing-canvas"
    />
  );
};

export default React.forwardRef(Canvas); 