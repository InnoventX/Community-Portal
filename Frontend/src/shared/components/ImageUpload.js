import React,{useEffect, useRef, useState} from 'react';

import "./ImageUpload.css";

const ImageUpload = (props) => {

    const filePickerRef = useRef();

    const [file , setFile] = useState();
    // If the imagee is option then we don't perform validation by setting isValid = true
    const [isValid , setIsValid] = useState(props.isVaild || false);
    const [previewUrl , setPreviewUrl] = useState();

    const pickHandler = (event) => {
        let fileIsValid = isValid;
        let pickedFile;

        // Checking for the single image file
        if(event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            // useEffect will be triggered when the file state is changed
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid=true;
        }else{
            setIsValid(false);
            fileIsValid=false;
        }
        props.onInput(props.id, pickedFile , fileIsValid);
    }

    const pickImageHandler = (event) => {
        event.preventDefault();
        // Shows the file input tag
        filePickerRef.current.click();
    }

    // This will be triggered when the file state is changed
    useEffect(() => {
        if(!file){
            return;
        }
        // For reading the file
        const fileReader = new FileReader();

        // When the image is loaded
        fileReader.onload = () => {
            // Store the image url
            setPreviewUrl(fileReader.result);
        }

        // Read the file as data url to store the url of image
        fileReader.readAsDataURL(file);
    },[file]);

    return(
        <React.Fragment>
            {/* Takes image files as input */}
            <input 
                id={props.id}
                style={{display:"none"}}
                ref={filePickerRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={pickHandler}
            />

            {/* Showing the image preview */}
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className={`image-upload__preview ${props.previewClass}`}>
                    { previewUrl && <img src={previewUrl} alt="Preview" /> }
                    { !previewUrl && <p>Please pick an image</p>}
                </div>

                {/* Show the input tag if the button is clicked */}
                <button onClick={pickImageHandler}>Pick Image</button>
            </div>
        </React.Fragment>
    )
}

export default ImageUpload;