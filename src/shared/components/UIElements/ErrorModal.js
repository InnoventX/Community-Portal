import React from 'react';

import "./ErrorModal.css";

const ErrorModal = (props) => {
    return(
        <div className="show-error-section">
            <h1>{props.heading}</h1>
            <p>{props.error}</p>
        </div>
    )
} 

export default ErrorModal;