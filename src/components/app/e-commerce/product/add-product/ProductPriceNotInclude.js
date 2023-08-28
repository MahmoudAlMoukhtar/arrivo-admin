import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Flex from 'components/common/Flex';

const ProductPriceNotInclude = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'priceNotInclude'
  });

  const [includeItem, setIncludeItem] = useState({ p: '' });
  return (
    <Card className="my-3">
      <Card.Header as="h6" className="bg-light">
        السعر لا يشمل
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
            stroke="#FF6666"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Card.Header>
      <Card.Body>
        {fields.map((item, index) => (
          <Row key={index} className="gx-2 flex-between-center mb-3">
            <Col sm={11}>
              <Flex justifyContent="start" alignItems="center" gap="2px">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
                    stroke="#FF6666"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h6 className="mb-0 text-600">{item.p}</h6>
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
              value={includeItem.p}
              onChange={e => {
                setIncludeItem({ p: e.target.value });
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
                disabled={includeItem.p === ''}
                onClick={() => {
                  append({ p: includeItem.p });
                  setIncludeItem({ p: '' });
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

export default ProductPriceNotInclude;
