import React from 'react';
import { Card, Col, Button, Row } from 'react-bootstrap';

const ProductFooter = ({ edit }) => {
  return (
    <Card>
      <Card.Body>
        <Row className="flex-between-center">
          <Col md>
            <h5 className="mb-2 mb-md-0">أنت على وشك الإنتهاء</h5>
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit">
              {edit ? 'تعديل' : 'إضافة رحلة'}
            </Button>
            <Button
              variant="link"
              className="text-secondary fw-medium p-0 me-3"
              type="button"
            >
              تجاهل
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductFooter;
