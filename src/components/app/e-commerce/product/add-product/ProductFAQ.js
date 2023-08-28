import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useFieldArray } from 'react-hook-form';

const ProductFAQ = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tripFAQs'
  });
  const [tripFAQs, setTripFAQs] = useState({
    q: '',
    a: ''
  });
  return (
    <Card className="my-3">
      <Card.Header as="h6" className="bg-light">
        الأسئلة الشائعة{' '}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.879 7.519C11.05 6.494 12.95 6.494 14.121 7.519C15.293 8.544 15.293 10.206 14.121 11.231C13.918 11.41 13.691 11.557 13.451 11.673C12.706 12.034 12.001 12.672 12.001 13.5V14.25M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 17.364C17.5282 18.1997 16.5361 18.8626 15.4442 19.3149C14.3522 19.7672 13.1819 20 12 20C10.8181 20 9.64778 19.7672 8.55585 19.3149C7.46392 18.8626 6.47177 18.1997 5.63604 17.364C4.80031 16.5282 4.13738 15.5361 3.68508 14.4442C3.23279 13.3522 3 12.1819 3 11C3 8.61305 3.94821 6.32387 5.63604 4.63604C7.32387 2.94821 9.61305 2 12 2C14.3869 2 16.6761 2.94821 18.364 4.63604C20.0518 6.32387 21 8.61305 21 11ZM12 16.25H12.008V16.258H12V16.25Z"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Card.Header>
      <Card.Body>
        {fields.map((tripFAQs, index) => (
          <Row key={index} className="gx-2 flex-between-center mb-3">
            <Col sm={12}>
              <h6 className="mb-0 text-600">السؤال: {tripFAQs.q}</h6>
            </Col>

            <Col sm={11}>
              <h6 className="mb-0 text-700">الجواب: {tripFAQs.a}</h6>
            </Col>
            <Col sm={1}>
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
            </Col>
            <hr />
          </Row>
        ))}
        <Row className="gy-3 gx-2">
          <Col sm={12}>
            <Form.Control
              type="text"
              size="sm"
              name="tripFAQsQustion"
              placeholder="q"
              value={tripFAQs.q}
              onChange={e => setTripFAQs({ ...tripFAQs, q: e.target.value })}
              isInvalid={errors.tripFAQs}
            />
          </Col>
          <Col sm={12}>
            <Form.Control
              type="text"
              size="sm"
              name="tripFAQsAnswer"
              placeholder="a"
              value={tripFAQs.a}
              onChange={e =>
                setTripFAQs({
                  ...tripFAQs,
                  a: e.target.value
                })
              }
              isInvalid={errors.tripFAQs}
            />
          </Col>
          <Col xs={12}>
            <div className="d-grid gap-2">
              <Button
                variant="falcon-default"
                size="lg"
                className="me-2"
                type="button"
                disabled={tripFAQs.q === '' || tripFAQs.a === ''}
                onClick={() => {
                  append({
                    q: tripFAQs.q,
                    a: tripFAQs.a
                  });
                  setTripFAQs({
                    q: '',
                    a: ''
                  });
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

export default ProductFAQ;
