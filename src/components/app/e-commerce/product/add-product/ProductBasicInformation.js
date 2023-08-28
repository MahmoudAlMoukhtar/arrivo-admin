import CardDropdown from 'components/common/CardDropdown';
import Flex from 'components/common/Flex';
import { getSize } from 'helpers/utils';
import React from 'react';
import { Button, Card, Col, Dropdown, Form, Image, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import app from '../.../../../../../../firebase';
function PreviewExample({ errors }) {
  const [files, setFiles] = React.useState([]);
  const [fileUploadProgress, setFileUploadProgress] = React.useState(0);

  const { setValue } = useFormContext();
  // const db = getFirestore(app);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    onDrop: acceptedFiles => {
      /*       setValue('thumTripImge', acceptedFiles[0]); */

      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const handleRemove = path => {
    setFiles(files.filter(file => file.path !== path));
    setValue('thumTripImge', '');
  };

  const handleUpload = async acceptedFiles => {
    const file = acceptedFiles[0];
    const storage = getStorage(app);
    const storageRef = ref(storage, `trips/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadProgress(progress);
      },
      error => {
        console.error(error);
      },
      async () => {
        console.log('downloadURL');
        const downloadURL = await getDownloadURL(storageRef);
        console.log('downloadURL', downloadURL);
        setValue('thumTripImge', downloadURL);
        // setFiles([
        //   Object.assign(file, {
        //     preview: URL.createObjectURL(file)
        //   })
        // ]);
      }
    );
  };

  return (
    <div className="px-2" dir="en">
      <div
        {...getRootProps({
          className: `dropzone-area py-6 ${
            errors.thumTripImge ? 'border-danger' : ''
          }`
        })}
      >
        <input name="thumTripImge" {...getInputProps()} />
        <Flex justifyContent="center">
          <img src={cloudUpload} alt="" width={25} className="me-2" />
          <p className="fs-0 mb-0 text-700">Drop your image here</p>
        </Flex>
      </div>
      {files.length > 0 && (
        <Button
          variant="primary"
          size="sm"
          style={{ width: '100%' }}
          className="me-2 mt-2"
          onClick={() => {
            setFileUploadProgress(0);
            console.log('tet');
            handleUpload(files);
          }}
        >
          Upload File
        </Button>
      )}
      <div className="mt-3">
        {files.map(file => (
          <Flex
            alignItems="center"
            className="py-3 border-bottom btn-reveal-trigger"
            key={file.path}
          >
            <Image
              rounded
              width={40}
              height={40}
              src={file.preview}
              alt={file.path}
            />
            <Flex
              justifyContent="between"
              alignItems="center"
              className="ms-3 flex-1"
            >
              <div>
                <h6>{file.path}</h6>
                <Flex className="position-relative" alignItems="center">
                  <p className="mb-0 fs--1 text-400 line-height-1">
                    <strong>{getSize(file.size)}</strong>
                  </p>
                </Flex>
              </div>
            </Flex>
            <CardDropdown>
              <div className="py-2">
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => handleRemove(file.path)}
                >
                  Remove
                </Dropdown.Item>
              </div>
            </CardDropdown>
          </Flex>
        ))}
        {fileUploadProgress > 0 && (
          <div className="progress" style={{ width: '100%' }}>
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
      </div>
    </div>
  );
}

const ProductBasicInformation = ({ tripType }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        المعلومات الأساسية
      </Card.Header>
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col md="12">
            <Form.Group>
              <Form.Label>
                اسم الرحلة:<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                isInvalid={errors.productName}
                {...register('productName')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.productName && errors.productName.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {tripType === 'daily' ? (
            <Col md="12">
              <Form.Group>
                <Form.Label>
                  عدد ساعات الرحلة:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  isInvalid={!!errors.tripHours}
                  {...register('tripHours')}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tripHours && errors.tripHours.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          ) : (
            <React.Fragment>
              <Col md="6">
                <Form.Group>
                  <Form.Label>
                    عدد أيام الرحلة:<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    isInvalid={!!errors.tripLongDate}
                    {...register('longDate.days')}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tripLongDate && errors.tripLongDate.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group>
                  <Form.Label>
                    عدد ليالي الرحلة:<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    isInvalid={!!errors.tripLongDate}
                    {...register('longDate.nights')}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tripLongDate && errors.tripLongDate.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </React.Fragment>
          )}
          <Col md="12">
            <Form.Group>
              <Form.Label>
                ملخص الرحلة/معلومات الرحلة:{' '}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                isInvalid={!!errors.productSummery}
                {...register('productSummery')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.productSummery && errors.productSummery.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md="12">
            <Form.Group>
              <Form.Label>
                نوع العرض:
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                {...register('tripOfferCategory')}
                isInvalid={errors.tripOfferCategory}
              />
            </Form.Group>
          </Col>
          <Col md="12">
            <Form.Group>
              <Form.Label>
                الصورة المصغرة للرحلة/غلاف الرحلة:
                <span className="text-danger">*</span>
              </Form.Label>
              <PreviewExample errors={errors} />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductBasicInformation;

ProductBasicInformation.propTypes = {
  tripType: PropTypes.string
};

PreviewExample.propTypes = {
  errors: PropTypes.any
};
