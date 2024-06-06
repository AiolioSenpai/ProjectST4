import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LoadingPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={80} thickness={5} />
    </div>
  );
};

export default LoadingPage;

{/* <video autoPlay loop muted style={{ width: '100%', height: '100vh' }}>
<source src="loading-video.mp4" type="video/mp4" />
</video>  To play a video during load use this */}