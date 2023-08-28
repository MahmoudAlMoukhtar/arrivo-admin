import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Flex from 'components/common/Flex';

const ProductNotesImportant = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productNotesImportant'
  });

  const [item, setItem] = useState({ n: '' });
  return (
    <Card className="my-3">
      <Card.Header as="h6" className="bg-light">
        معلومات مهمة
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5" cy="5" r="5" fill="#F6882F" />
        </svg>
      </Card.Header>
      <Card.Body>
        {fields.map((item, index) => (
          <Row key={index} className="gx-2 flex-between-center mb-3">
            <Col sm={11}>
              <Flex justifyContent="start" alignItems="center" gap="2">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="#F6882F" />
                </svg>
                <h6 className="mb-0 text-600">{item.n}</h6>
              </Flex>
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
          <Col sm={9}>
            <Form.Control
              type="text"
              size="sm"
              placeholder="عنصر"
              value={item.n}
              onChange={e => {
                setItem({ n: e.target.value });
              }}
            />
          </Col>
          <Col sm={3}>
            <div className="d-grid gap-2">
              <Button
                variant="falcon-default"
                size="sm"
                className="me-2"
                type="button"
                disabled={item.n === ''}
                onClick={() => {
                  append({ n: item.n });
                  setItem({ n: '' });
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

export default ProductNotesImportant;
