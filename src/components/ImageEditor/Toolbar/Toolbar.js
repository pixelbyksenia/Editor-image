import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import './Toolbar.css';

const Toolbar = ({ onSave, onUndo, onRedo, canUndo, canRedo }) => {
  return (
    <Box className="toolbar">
      <Tooltip title="Отменить">
        <span>
          <IconButton 
            sx={{ color: '#483D8B' }}
            onClick={onUndo}
            disabled={!canUndo}
          >
            <UndoIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Повторить">
        <span>
          <IconButton 
            sx={{ color: '#483D8B' }}
            onClick={onRedo}
            disabled={!canRedo}
          >
            <RedoIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Сохранить изображение">
        <IconButton 
          sx={{ color: '#483D8B' }}
          onClick={onSave}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Toolbar; 