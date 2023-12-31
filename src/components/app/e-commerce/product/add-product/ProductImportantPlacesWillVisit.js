import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import MultiSelect from 'components/common/MultiSelect';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../../../../../firebase';
const ProductImportantPlacesWillVisit = () => {
  const [listContent, setListContent] = useState([]);
  const {
    control,
    formState: { errors }
  } = useFormContext();

  useEffect(() => {
    async function fetchListContent() {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'placesWillVisit'));
      const listContent = querySnapshot.docs.map(doc => doc.data());
      setListContent(listContent);
    }
    fetchListContent();
  }, []);

  let placeOptions = listContent.map(p => {
    return { value: p.name, label: p.name, imgURL: p.imgURL };
  });

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        أبرز الأماكن التي ستزورها:
      </Card.Header>
      {/* <PreviewExample /> */}
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Group>
              <Form.Label>
                إضافة الأماكن:
                <span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex  flex-column gap-2">
                <Controller
                  name="mostPlacesWillVisit"
                  control={control}
                  render={({ field, ref }) => (
                    <MultiSelect
                      {...field}
                      ref={ref}
                      closeMenuOnSelect={false}
                      isMulti
                      options={placeOptions}
                      onChange={selectedOptions => {
                        field.onChange(selectedOptions);
                      }}
                      className={errors.mostPlacesWillVisit ? 'is-invalid' : ''}
                    />
                  )}
                />
              </div>
              {/* errors.mostPlacesWillVisit && (
                <p style={{ fontSize: '12px', color: 'red' }}>
                  This is required.
                </p>
              ) */}
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductImportantPlacesWillVisit;
