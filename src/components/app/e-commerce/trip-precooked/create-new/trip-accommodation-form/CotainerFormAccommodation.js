import React from 'react';
import app from '../../../../../../firebase';
import AddNewAccommodation from './AddNewAccommodation';
import * as yup from 'yup';
import { Form } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const schema = yup
  .object({
    hotel: yup.string().required('This field is required.'),
    location: yup.string().required('This field is required.')
    //imgURL: yup.string().required('This field is required.')
  })
  .required();

// CotainerFormAccommodation.propTypes = {
//   // You can declare that a prop is a specific JS primitive.
//   setLoading: PropTypes.func,
//   setError: PropTypes.func
// };

const CotainerFormAccommodation = ({ setLoading, setError }) => {
  const methods = useForm({
    resolver: yupResolver(schema)
  });
  const { handleSubmit } = methods;

  const onSubmit = async data => {
    console.log(data);
    setLoading(true);
    const db = getFirestore(app);
    const storage = getStorage(app);
    async function uploadImageAndGetUrl(file) {
      // Create a unique filename for the image by appending a timestamp to its original filename
      const now = new Date();
      data.date = now.getTime();
      const folder = 'accommodation';
      const filename = folder + '/' + now.getTime() + '-' + file.name;

      // Upload the image to Firebase Storage
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    }

    const imgURLDownloadUrl = await uploadImageAndGetUrl(data.imgURL[0]);
    // Add the download URL of the accommodation file to the data object
    data.imgURL = imgURLDownloadUrl;
    // Upload the images and get their URLs, then add the data to the database
    addDoc(collection(db, 'accommodation'), data)
      .then(docRef => {
        setLoading(false);
        console.log('success');
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(error => {
        setLoading(false);
        setError(true);
        console.error('Error adding document: ', error);
      });
  };
  return (
    <FormProvider {...methods}>
      <Form dir="rtl" onSubmit={handleSubmit(onSubmit)}>
        <AddNewAccommodation />
      </Form>
    </FormProvider>
  );
};

export default CotainerFormAccommodation;
