import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Flex from 'components/common/Flex';

const ProductFAQ = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tripFAQs'
  });
  const [tripFAQs, setTripFAQs] = useState({
    q: '',
    a: ''
  });
  return (
    <Card className="mb-3 mb-lg-0">
      <Card.Header as="h6" className="bg-light">
        Trip FAQ
      </Card.Header>
      <Card.Body>
        {fields.map((tripFAQs, index) => (
          <Row key={index} className="gx-2 flex-between-center mb-3">
            <Col sm={3}>
              <h6 className="mb-0 text-600">{tripFAQs.q}</h6>
            </Col>
            <Col sm={9}>
              <Flex justifyContent="between" alignItems="center">
                <h6 className="mb-0 text-700">{tripFAQs.a}</h6>
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
          <Col sm={3}>
            <Form.Control
              type="text"
              size="sm"
              name="tripFAQsQustion"
              placeholder="q"
              value={tripFAQs.q}
              onChange={e => setTripFAQs({ ...tripFAQs, q: e.target.value })}
            />
          </Col>
          <Col sm={9}>
            <Flex
              justifyContent="between"
              alignItems="center"
              className="gap-2"
            >
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
              />
              <Button
                variant="falcon-default"
                size="sm"
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
                Add
              </Button>
            </Flex>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductFAQ;
