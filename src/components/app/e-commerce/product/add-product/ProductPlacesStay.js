import React, { useEffect, useState } from 'react';
//import MultiSelect from 'components/common/MultiSelect';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import MultiSelect from 'components/common/MultiSelect';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../../../../../firebase';

const ProductPlacesStay = () => {
  const [listAccommodation, setListAccommodation] = useState([]);
  const {
    control,
    formState: { errors }
  } = useFormContext();
  useEffect(() => {
    async function fetchListContent() {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'accommodation'));
      const listAccommodation = querySnapshot.docs.map(doc => doc.data());
      setListAccommodation(listAccommodation);
    }
    fetchListContent();
  }, []);
  const accommodationOptions = listAccommodation.map(acc => {
    return {
      value: {
        location: acc.location,
        hotel: acc.hotel,
        image: acc.imgURL
      },
      label: `${acc.location}/${acc.hotel}`
    };
  });
  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        أماكن الإقامة:
      </Card.Header>
      {/* <PreviewExample /> */}
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Group>
              <Form.Label>إضافة أماكن الإقامة:</Form.Label>
              <div className="d-flex  flex-column gap-2">
                <Controller
                  name="tripPlacesStay"
                  render={({ field, ref }) => (
                    <MultiSelect
                      {...field}
                      ref={ref}
                      closeMenuOnSelect={false}
                      isMulti
                      options={accommodationOptions}
                      onChange={selectedOptions => {
                        field.onChange(selectedOptions);
                      }}
                      className={errors.tripPlacesStay ? 'is-invalid' : ''}
                    />
                  )}
                  control={control}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductPlacesStay;
