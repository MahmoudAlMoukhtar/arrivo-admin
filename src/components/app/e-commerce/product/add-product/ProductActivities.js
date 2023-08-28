import React, { useState } from 'react';
import MultiSelect from 'components/common/MultiSelect';
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row
} from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

const ProductActivities = () => {
  const { control } = useFormContext();
  const [tagInput, setTagInput] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleAddActivitie = () => {
    if (
      tagInput !== '' &&
      !selectedActivities.some(tag => tag.label === tagInput)
    ) {
      setSelectedActivities([
        ...selectedActivities,
        { value: tagInput, label: tagInput }
      ]);
      setTagInput('');
    }
  };

  const activitiesOptions = [
    { value: 'ركوب الخيل.', label: 'ركوب الخيل.' },
    { value: 'مدينة الألعاب.', label: 'مدينة الألعاب.' },
    { value: 'ركوب الدراجات.', label: 'ركوب الدراجات.' },
    {
      value: 'الطيران الشراعي ( الباراشوت ).',
      label: 'الطيران الشراعي ( الباراشوت ).'
    }
  ];

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        أنشطة الرحلة:
      </Card.Header>
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Group>
              <Form.Label>إضافة أنشطة:</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Controller
                  name="tripActivities"
                  render={({ field, ref }) => (
                    <MultiSelect
                      {...field}
                      ref={ref}
                      closeMenuOnSelect={false}
                      isMulti
                      options={activitiesOptions}
                      onChange={selectedOptions => {
                        setSelectedActivities(selectedOptions);
                        field.onChange(selectedOptions);
                      }}
                      value={selectedActivities}
                    />
                  )}
                  control={control}
                />
                <InputGroup>
                  <div className="d-flex  flex-column gap-2">
                    <FormControl
                      placeholder="Enter a Item Content"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleAddActivitie}>
                      Add Item Content
                    </Button>
                  </div>
                </InputGroup>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductActivities;
