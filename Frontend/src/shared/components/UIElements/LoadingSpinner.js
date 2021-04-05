import React from 'react';
// import roundlogo from '../../photos/round-logo.svg'

import './LoadingSpinner.css';

const LoadingSpinner = props => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      {/* <img src={roundlogo} alt="logo"></img> */}
      <div class="loader">
        <span></span>
        <span></span>        
        <span></span>
        <span></span>
    </div>
    </div>
  );
};

export default LoadingSpinner;
