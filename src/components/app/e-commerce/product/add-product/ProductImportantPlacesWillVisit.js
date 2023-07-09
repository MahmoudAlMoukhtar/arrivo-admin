import React, { useState } from 'react';
//import MultiSelect from 'components/common/MultiSelect';
import {
  Card,
  Col,
  Form,
  Row,
  InputGroup,
  FormControl,
  Button,
  Image
} from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

import { useDropzone } from 'react-dropzone';
import Flex from 'components/common/Flex';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import CardDropdown from 'components/common/CardDropdown';
import { getSize } from 'helpers/utils';
import { Dropdown } from 'react-bootstrap';
import MultiSelect from 'components/common/MultiSelect';

const ProductImportantPlacesWillVisit = () => {
  const { control } = useFormContext();

  const placeOptions = [
    { value: 'دير سوميلا', label: 'دير سوميلا' },
    { value: 'مغار شال', label: 'مغار شال' },
    { value: 'مرتفعات سلطان مراد', label: 'مرتفعات سلطان مراد' },
    { value: 'قرية إيدر', label: 'قرية إيدر' },
    { value: 'قرية هامسي كوري', label: 'قرية هامسي كوري' },
    { value: 'بحيرة أوزنجول', label: 'بحيرة أوزنجول' },
    { value: 'نهر و وادي الرياح', label: 'نهر و وادي الرياح' },
    { value: 'شلال بولفيت', label: 'شلال بولفيت' }
  ];

  const [placeInput, setPlaceInput] = useState('');
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const handleAddPlace = () => {
    if (
      placeInput !== '' &&
      !selectedPlaces.some(Place => Place.label === placeInput)
    ) {
      setSelectedPlaces([
        ...selectedPlaces,
        { value: placeInput, label: placeInput }
      ]);
      setPlaceInput('');
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        Important Places Will Visit:
      </Card.Header>
      {/* <PreviewExample /> */}
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Group>
              <Form.Label>Add a keyword:</Form.Label>
              <div className="d-flex  flex-column gap-2">
                <Controller
                  name="mostPlacesWillVisit"
                  render={({ field, ref }) => (
                    <MultiSelect
                      {...field}
                      ref={ref}
                      closeMenuOnSelect={false}
                      isMulti
                      options={placeOptions}
                      onChange={selectedOptions => {
                        setSelectedPlaces(selectedOptions);
                        field.onChange(selectedOptions);
                      }}
                      value={selectedPlaces}
                    />
                  )}
                  control={control}
                />
                <InputGroup className="">
                  <FormControl
                    placeholder="Enter a place"
                    value={placeInput}
                    onChange={e => setPlaceInput(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleAddPlace}>
                    Add Place
                  </Button>
                </InputGroup>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductImportantPlacesWillVisit;

function PreviewExample() {
  const [files, setFiles] = React.useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    onDrop: acceptedFiles => {
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
/* mostPlacesWillVisit */
