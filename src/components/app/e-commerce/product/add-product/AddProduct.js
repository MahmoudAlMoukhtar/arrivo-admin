import React from 'react';
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
import ProductShipping from './ProductShipping';
import ProductStock from './ProductStock';
import ProductImportantPlacesWillVisit from './ProductImportantPlacesWillVisit';
import ProductListContent from './ProductListContent';
import ProductFAQ from './ProductFAQ';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../../../../firebase';
const schema = yup
  .object({
    productName: yup.string().required('This field is required.'),
    // manufacturarName: yup.string().required('This field is required.'),
    // identificationNumber: yup.string().required('This field is required.'),

    productSummery: yup.string().required('This field is required.'),
    importStatus: yup.string().required('This field is required.'),
    countryOrigin: yup.string().required('This field is required.'),
    productCategory: yup.string().required('This field is required.'),
    productSubCategory: yup.string().required('This field is required.'),
    tripLongDate: yup.string().required('This field is required.'),
    regularPrice: yup
      .number()
      .transform(value => (Number.isNaN(value) ? null : value))
      .nullable()
      .required('This field is required.')
  })
  .required();

const AddProduct = () => {
  const submittedValues = {};
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tripFAQs: [
        {
          q: 'Processor',
          a: '2.3GHz quad-core Intel Core i5'
        },
        {
          q: 'Memory',
          a: '8GB of 2133MHz LPDDR3 onboard memory'
        },
        {
          q: 'Brand name',
          a: 'Apple'
        }
      ]
    }
  });
  const { handleSubmit } = methods;

  const onSubmit = data => {
    console.log(data);
    const db = getFirestore(app);
    const storage = getStorage(app);
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
    // Upload the images and get their URLs, then add the data to the database
    Promise.all(data.uploadedFiles.map(uploadImageAndGetUrl))
      .then(downloadURLs => {
        // Add the download URLs to the trip data
        data.uploadedFiles = downloadURLs;

        // Add the data to the "trips" collection in Firestore
        return addDoc(collection(db, 'trips'), data);
      })
      .then(docRef => {
        console.log('success');
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
    // ------- Get all object keys form data and set empty values to reset ------------
    const keys = Object.keys(data);
    for (const key of keys) {
      submittedValues[key] = '';
    }
    // reset({ ...submittedValues });
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-3">
          <Col xs={12}>
            <ProductHeader />
          </Col>
          <Col lg={8}>
            <ProductBasicInformation />
            <ProductUpload />
            <ProductDetails />
            <ProductFAQ />
            <ProductPricing />
          </Col>
          <Col lg={4}>
            <div className="sticky-sidebar">
              <ProductType />
              <ProductTags />
              <ProductImportantPlacesWillVisit />
              <ProductListContent />
              <ProductShipping />
              <ProductStock />
            </div>
          </Col>
          <Col>
            <ProductFooter />
          </Col>
        </Row>
      </Form>
    </FormProvider>
  );
};

export default AddProduct;
