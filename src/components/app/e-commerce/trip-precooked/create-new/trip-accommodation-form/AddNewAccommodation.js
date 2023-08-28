import React from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  FormControl,
  Image,
  InputGroup,
  Row
} from 'react-bootstrap';
import Flex from 'components/common/Flex';
import CardDropdown from 'components/common/CardDropdown';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import { useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { getSize } from 'helpers/utils';

const AddNewAccommodation = () => {
  const { register } = useFormContext();

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        اضافة فندق جديد:
      </Card.Header>
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xl={12}>
            <PreviewExample />
          </Col>
          <Col xs="12">
            <Form.Group>
              <Form.Label>موقع الفندق :</Form.Label>
              <div className="d-flex flex-column gap-2">
                <InputGroup>
                  <Col xs={12}>
                    <FormControl
                      type="text"
                      placeholder="أدخل موقع الفندق"
                      {...register('location')}
                    />
                  </Col>
                </InputGroup>
              </div>
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group>
              <Form.Label>اسم الفندق :</Form.Label>
              <div className="d-flex flex-column gap-2">
                <InputGroup>
                  <Col xs={12}>
                    <FormControl
                      type="text"
                      placeholder="أدخل اسم الفندق"
                      {...register('hotel')}
                    />
                  </Col>
                </InputGroup>
              </div>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                أضف فندق جديد
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AddNewAccommodation;

function PreviewExample() {
  const [files, setFiles] = React.useState([]);
  const { setValue } = useFormContext();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    onDrop: acceptedFiles => {
      setValue('imgURL', acceptedFiles);
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
  };

  return (
    <div className="px-2">
      <div {...getRootProps({ className: 'dropzone-area py-6' })}>
        <input {...getInputProps()} />
        <Flex justifyContent="center">
          <img src={cloudUpload} alt="" width={25} className="me-2" />
          <p className="fs-0 mb-0 text-700">Drop your image here</p>
        </Flex>
      </div>

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
      </div>
    </div>
  );
}
