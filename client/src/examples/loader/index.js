// src/components/LoadingScreen.js
import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import './loader.css';

const LoadingScreen = () => {
  const theme = useTheme();
  const textColor = theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* <CircularProgress size={60} /> */}
      <div className="loader"></div>
      <Typography variant="h6" sx={{ mt: 2, color: textColor }}>
        Fetching Your data, please wait
      </Typography>
    </Box>
  );
};

export default LoadingScreen;


