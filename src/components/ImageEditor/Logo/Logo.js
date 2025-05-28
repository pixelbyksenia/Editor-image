import React from 'react';
import { Box, Typography } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import './Logo.css';

const Logo = () => {
  return (
    <Box className="logo-container">
      <Box className="logo-icon">
        <BrushIcon />
        <svg className="logo-circle">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </Box>
      <Typography variant="h5" className="logo-text">
        Editor
        <span className="logo-dot">.</span>
      </Typography>
    </Box>
  );
};

export default Logo; 