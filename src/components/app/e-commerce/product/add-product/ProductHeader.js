import React from 'react';
import { Card, Col, Button, Row } from 'react-bootstrap';

const ProductHeader = ({ edit }) => {
  return (
    <Card>
      <Card.Body>
        <Row className="flex-between-center">
          <Col md>
            <h5 className="mb-2 mb-md-0">{edit ? 'تعديل' : 'إضافة رحلة'}</h5>
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit">
              {edit ? 'تعديل' : 'إضافة رحلة'}
            </Button>
            <Button
              variant="link"
              className="text-secondary fw-medium p-0 me-3"
              type="reset"
            >
              تجاهل
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductHeader;
