import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProductBasicInformation from './ProductBasicInformation';
import ProductHeader from './ProductHeader';
import ProductUpload from './ProductUpload';
import ProductFooter from './ProductFooter';
import ProductDetails from './ProductDetails';
import ProductType from './ProductType';
import ProductTags from './ProductTags';
import ProductPricing from './ProductPricing';
// import ProductStock from './ProductStock';
import ProductImportantPlacesWillVisit from './ProductImportantPlacesWillVisit';
import ProductListContent from './ProductListContent';
import ProductFAQ from './ProductFAQ';
import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../../../../firebase';
import ProductPlacesStay from './ProductPlacesStay';
import ProductPrgramTrack from './ProductPrgramTrack';
import ProductDailyTrack from './ProductDailyTrack';
import ProductActivities from './ProductActivities';
import ProductTerms from './ProductTerms';
//import { v4 as uuidv4 } from 'uuid';
import ProductPriceInclude from './ProductPriceInclude';
import ProductPriceNotInclude from './ProductPriceNotInclude';
import ProductNotesImportant from './ProductNotesImportant';
import ProductProgramFile from './ProductProgramFile';
import PropTypes from 'prop-types';

const AddProduct = ({ copiedProduct, edit }) => {
  const [tripType, setTripType] = useState(
    copiedProduct?.tripType ? copiedProduct?.tripType : 'programs'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const submittedValues = {};

  const schema = yup
    .object({
      productName: yup.string().required('This field is required.'),

      thumTripImge: yup.string().required('This field is required.'),
      tripOfferCategory: yup.string().required('This field is required.'),
      productSummery: yup.string().required('This field is required.'),
      // importStatus: yup.string().required('This field is required.'),
      countryOrigin: yup.string().required('This field is required.'),
      tripCategory: yup.string().required('This field is required.'),
      tripType: yup.string().required('This field is required.'),
      mostPlacesWillVisit: yup.array().required('This field is required.'),
      //tripListContent: yup.array().required('This field is required.'),
      tripPlacesStay: yup.array().required('This field is required.'),
      tags: yup.array().required('This field is required.'),
      tripProgramTrack: yup.array().min(1),
      tripPackages: yup.array().min(1),
      tripFAQs: yup.array().min(1),
      tripTerms: yup.array().min(1),
      tripTermsSecription: yup.string().required('This field is required.'),
      uploadedFiles: yup.array().required('This field is required.'),
      // tripProgramTrack: yup.array().when('tripType', {
      //   is: 'programs',
      //   then: yup.array().min(1, 'At least one program track is required.'),
      //   otherwise: yup.array()
      // }),
      regularPrice: yup
        .number()
        .transform(value => (Number.isNaN(value) ? null : value))
        .nullable()
        .required('This field is required.')
    })
    .required();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...copiedProduct
    }
  });

  const { handleSubmit } = methods;
  const onSubmit = async data => {
    console.log(data);
    setLoading(true);
    //get database from firestore database in firebase
    const db = getFirestore(app);
    const storage = getStorage(app);
    //func uploadw image to storage
    async function uploadImageAndGetUrl(file) {
      // Create a unique filename for the image by appending a timestamp to its original filename
      const now = new Date();
      const folder = 'trips';
      const filename = folder + '/' + now.getTime() + '-' + file.name;
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }

    if (edit) {
      const db = getFirestore(app);
      const tripsRef = collection(db, 'trips');

      //handle updating doc and if error catch it
      try {
        // Get the document by id directly
        const docRef = doc(tripsRef, copiedProduct.id);
        if (
          Array.isArray(data.uploadedFiles) &&
          data.uploadedFiles.every(item => typeof item !== 'string')
        ) {
          Promise.all(data.uploadedFiles.map(uploadImageAndGetUrl))
            .then(async downloadURLs => {
              // Add the download URLs to the trip data
              data.uploadedFiles = downloadURLs;
            })
            .then(async () => {
              setLoading(false);
              //update doc
              await updateDoc(docRef, data);
              setLoading(false);
              console.log('Document updated successfully');
            })
            .catch(error => {
              setLoading(false);
              setError(true);
              console.log('Error in update doc!', error.message);
            });
        } else {
          await updateDoc(docRef, data);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setError(true);
        console.log('Error in update doc!', err.message);
      }
    } else {
      /*    const thumbTripImageDownloadUrl = await uploadImageAndGetUrl(
        data.thumTripImge[0]
      );
      // Add the download URL of the thumbTripImage file to the data object
      data.thumTripImge = thumbTripImageDownloadUrl; */
      // Upload the images and get their URLs, then add the data to the database
      Promise.all(data.uploadedFiles.map(uploadImageAndGetUrl))
        .then(downloadURLs => {
          // Add the download URLs to the trip data
          data.uploadedFiles = downloadURLs;

          // Add the data to the "trips" collection in Firestore
          const docRef = doc(collection(db, 'trips'));
          return setDoc(docRef, { ...data, id: docRef.id }); // set the id field to the docRef.id
        })
        .then(() => {
          setLoading(false);
          console.log('success');
        })
        .catch(error => {
          setLoading(false);
          setError(true);
          console.error('Error adding document: ', error);
        });
      // ------- Get all object keys form data and set empty values to reset ------------
      const keys = Object.keys(data);
      for (const key of keys) {
        submittedValues[key] = '';
      }
      // reset({ ...submittedValues });
    }
  };
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error!!!</h2>;
  return (
    <FormProvider {...methods}>
      <Form dir="rtl" onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-3">
          <Col xs={12}>
            <ProductHeader edit={edit} />
          </Col>
          <Col lg={8}>
            <ProductType setTripType={setTripType} />
            <ProductBasicInformation tripType={tripType} />
            {tripType !== 'daily' && <ProductProgramFile />}
            <ProductUpload />
            <ProductDetails />
            {tripType === 'programs' ? (
              <ProductPrgramTrack />
            ) : (
              <ProductDailyTrack />
            )}
            <ProductPricing />
            {tripType === 'daily' && <ProductPriceInclude />}
            {tripType === 'daily' && <ProductPriceNotInclude />}
            {tripType === 'daily' && <ProductNotesImportant />}
            <ProductFAQ />
            {tripType === 'programs' && <ProductTerms />}
          </Col>
          <Col lg={4}>
            <div className="sticky-sidebar">
              <ProductImportantPlacesWillVisit />
              {tripType === 'programs' && <ProductListContent />}
              {tripType === 'daily' && <ProductActivities />}
              <ProductPlacesStay />
              <ProductTags />
              {/* <ProductShipping /> */}
              {/* <ProductStock /> */}
            </div>
          </Col>
          <Col>
            <ProductFooter edit={edit} />
          </Col>
        </Row>
      </Form>
    </FormProvider>
  );
};

export default AddProduct;

AddProduct.propTypes = {
  copiedProduct: PropTypes.object,
  edit: PropTypes.bool
};
