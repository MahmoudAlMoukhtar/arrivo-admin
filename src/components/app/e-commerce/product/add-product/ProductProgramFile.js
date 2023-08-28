import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import app from '../../../../../firebase';

const ProductProgramFile = () => {
  const {
    setValue,
    formState: { errors }
  } = useFormContext();
  const [file, setFile] = useState(null);
  //const [fileRef, setFileRef] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf',
    onDrop: acceptedFiles => {
      setFile(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0])
        })
      );
    }
  });

  const handleRemove = () => {
    setValue('programFile', null);
    setFile(null);
    //setFileRef(null);
  };

  const handleUpload = async file => {
    // const db = getFirestore(app);
    const storage = getStorage(app);
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, `pdfs/${file.name}`);
    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        setFileUploadProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      error => {
        // Handle unsuccessful uploads
        console.error(error);
      },
      async () => {
        // Handle successful uploads on complete
        console.log('File uploaded successfully!');

        // Get the download URL for the file
        const downloadURL = await getDownloadURL(storageRef);
        setValue('programFile', downloadURL);
      }
    );
  };

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        إضافة ملف الرحلة (اختياري)
      </Card.Header>
      <Card.Body>
        <div
          {...getRootProps({
            className: ` dropzone-area py-2 mb-2 ${
              errors.programFile && 'border-danger'
            }`
          })}
        >
          <input name="programFile" {...getInputProps()} />

          {file ? (
            <div className="fs--1">
              <span>{file.name}</span>
              <Button
                variant="link"
                size="sm"
                className="p-0 fs--1 ms-2"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className={`${errors.programFile} fs--1`}>
              <img src={cloudUpload} alt="" width={25} className="me-2" />
              <span className="d-none d-lg-inline">
                Drag your program file here
                <br />
              </span>
              <Button variant="link" size="sm" className="p-0 fs--1">
                Browse
              </Button>
            </div>
          )}
          {`Upload File is ${fileUploadProgress ? fileUploadProgress : 0}%`}
        </div>

        {file && (
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => handleUpload(file)}
          >
            Upload File
          </Button>
        )}
        {/* 
        {fileRef && (
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            Download File
          </Button>
        )} */}
      </Card.Body>
      {fileUploadProgress > 0 && (
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${fileUploadProgress}%` }}
            aria-valuenow={fileUploadProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {fileUploadProgress}%
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProductProgramFile;
