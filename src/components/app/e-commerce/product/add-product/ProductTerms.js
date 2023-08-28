import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Flex from 'components/common/Flex';

const ProductTerms = () => {
  const {
    control,
    formState: { errors },
    register
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tripTerms'
  });

  const [tripTerm, settripTerm] = useState({ t: '' });
  return (
    <Card className="mb-3 mb-lg-0">
      <Card.Header as="h6" className="bg-light">
        شروط وأحكام
        <svg
          width="25"
          height="25"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 17.0005L15 20.0005L20 13.0005M16 3.61914C12.981 6.48612 8.96035 8.05858 4.79734 8.00047C4.26779 9.61378 3.99863 11.3011 4.00001 12.9991C4.00001 20.4551 9.09867 26.7191 16 28.4965C22.9013 26.7205 28 20.4565 28 13.0005C28 11.2538 27.72 9.57247 27.2027 7.99914H27C22.7387 7.99914 18.8667 6.33514 16 3.61914Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Card.Header>
      <Card.Body>
        {fields.map((term, index) => (
          <Row key={index} className="gx-2 flex-between-center mb-3">
            <Col sm={11}>
              <h6 className="mb-0 text-600">{term.t}</h6>
            </Col>
            <Col sm={1}>
              <Flex justifyContent="between" alignItems="center">
                <Button
                  variant="link"
                  to="#!"
                  type="button"
                  className="text-danger"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <FontAwesomeIcon className="fs--1" icon="trash-alt" />
                </Button>
              </Flex>
            </Col>
          </Row>
        ))}
        <Row className="gy-3 gx-2">
          <Col sm={12}>
            <Form.Group controlId="personsCount">
              <Form.Label>وصف الأحكام والشروط:</Form.Label>
              <Form.Control
                type="text"
                {...register('tripTermsSecription')}
                isInvalid={errors.tripTermsSecription}
              />
            </Form.Group>
          </Col>
          <Col sm={9}>
            <Form.Control
              type="text"
              size="sm"
              placeholder="شرط/حكم"
              value={tripTerm.t}
              onChange={e => {
                settripTerm({ t: e.target.value });
              }}
              isInvalid={errors.tripTerms}
            />
          </Col>
          <Col sm={3}>
            <div className="d-grid gap-2">
              <Button
                variant="falcon-default"
                size="sm"
                className="me-2"
                type="button"
                disabled={tripTerm.t === ''}
                onClick={() => {
                  append({ t: tripTerm.t });
                  settripTerm({ t: '' });
                }}
              >
                إضافة
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductTerms;
