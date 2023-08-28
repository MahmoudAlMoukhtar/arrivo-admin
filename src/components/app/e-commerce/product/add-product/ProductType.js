import React, { useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

const ProductType = ({ setTripType }) => {
  const {
    setValue,
    register,
    formState: { errors },
    watch
  } = useFormContext();

  const [customInput, setCustomInput] = useState('');
  const [selectCategory, setselectCategory] = useState(watch('tripCategory'));

  // const handleCustomCategory = () => {
  //   if (customInput !== '' && !selectCategory !== customInput) {
  //     setselectCategory(customInput);
  //     setCustomInput('');
  //   }
  // };

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        نوع الرحلة
      </Card.Header>
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col md="12">
            <Form.Group>
              <Form.Label>
                اختار النوع:
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                {...register(`tripType`)}
                isInvalid={!!errors.tripType}
                onChange={e => {
                  setTripType(e.target.value);
                  setValue('tripProgramTrack', '');
                  setValue('tripActivities', '');
                }}
              >
                <option value="">Select</option>
                <option value="programs">برنامج</option>
                <option value="daily">يوم</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.productCategory?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md="12">
            <Form.Group>
              <Form.Label>
                صنف الرحلة:
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={selectCategory}
                isInvalid={!!errors.tripCategory}
                onChange={e => {
                  setselectCategory(e.target.value);
                  setValue('tripCategory', e.target.value);
                  setCustomInput('');
                }}
              >
                <option value="">Select</option>
                <option value="جماعية">جماعية</option>
                <option value="خاصة">خاصة</option>
                <option value="مع سائق">مع سائق</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.productSubCategory?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group>
              <Form.Control
                type="text"
                value={customInput}
                onChange={e => {
                  setCustomInput(e.target.value);
                  setValue('tripCategory', e.target.value);
                  setselectCategory('');
                  //handleCustomCategory();
                }}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductType;
ProductType.prototype = {
  setTripType: PropTypes.func
};
