import React, { useEffect, useState } from 'react';
import MultiSelect from 'components/common/MultiSelect';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../../../../../firebase';
const ProductListContent = () => {
  const [listContent, setListContent] = useState([]);
  const {
    control,
    formState: { errors }
  } = useFormContext();

  useEffect(() => {
    async function fetchListContent() {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'listContent'));
      const listContent = querySnapshot.docs.map(doc => doc.data());
      setListContent(listContent);
    }
    fetchListContent();
  }, []);

  let tagOptions = [
    { value: 'دير سوميلا', label: 'دير سوميلا' },
    { value: 'مغار شال', label: 'مغار شال' },
    { value: 'مرتفعات سلطان مراد', label: 'مرتفعات سلطان مراد' },
    { value: 'قرية إيدر', label: 'قرية إيدر' },
    { value: 'قرية هامسي كوري', label: 'قرية هامسي كوري' },
    { value: 'بحيرة أوزنجول', label: 'بحيرة أوزنجول' },
    { value: 'نهر و وادي الرياح', label: 'نهر و وادي الرياح' },
    { value: 'شلال بولفيت', label: 'شلال بولفيت' }
  ];

  tagOptions = listContent.map(c => {
    return { value: c.title, label: c.title, ...c };
  });

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        محتويات الرحلة:
      </Card.Header>
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Group>
              <Form.Label>
                إضافة المحتويات:<span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex flex-column gap-2">
                <Controller
                  name="tripListContent"
                  render={({ field, ref }) => (
                    <MultiSelect
                      {...field}
                      ref={ref}
                      closeMenuOnSelect={false}
                      isMulti
                      options={tagOptions}
                      onChange={selectedOptions => {
                        field.onChange(selectedOptions);
                      }}
                      className={errors.tripListContent ? 'is-invalid' : ''}
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

export default ProductListContent;
