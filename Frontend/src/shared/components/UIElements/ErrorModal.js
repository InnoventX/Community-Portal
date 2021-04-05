import React from 'react';

import "./ErrorModal.css";

const ErrorModal = (props) => {
    return(
        <div className="show-error-section">
            <div className="modal__header">
                <h2>{props.heading}</h2>
            </div>
            <div className="modal__content">
                <h5>{props.error}</h5>
            </div>
        </div>
    )
} 

export default ErrorModal;