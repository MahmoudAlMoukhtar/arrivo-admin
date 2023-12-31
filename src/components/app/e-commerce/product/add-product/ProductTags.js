import React, { useState } from 'react';
import MultiSelect from 'components/common/MultiSelect';
import {
  Card,
  Col,
  Form,
  Row,
  InputGroup,
  FormControl,
  Button
} from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';

const ProductTags = () => {
  const {
    control,
    formState: { errors },
    watch
  } = useFormContext();
  const tagOptions = [
    { value: 'camping', label: 'camping' },
    { value: 'familytrips', label: 'Family trips' },
    { value: 'soloTrips', label: 'Solo trips' },
    { value: 'activitiesAndAdventures', label: 'Activities And Adventures' },
    { value: 'honeyMoon', label: 'Honey moon' }
  ];

  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState(watch('tags'));

  const handleAddTag = () => {
    if (tagInput !== '' && !selectedTags.some(tag => tag.label === tagInput)) {
      setSelectedTags([...selectedTags, { value: tagInput, label: tagInput }]);
      setTagInput('');
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header as="h6" className="bg-light">
        Tags/الهاشتاجات
      </Card.Header>
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Group>
              <div className="d-flex  flex-column gap-2">
                <Form.Label>أضف Tag/هاشتاج:</Form.Label>
                <Controller
                  name="tags"
                  render={({ field, ref }) => (
                    <MultiSelect
                      {...field}
                      ref={ref}
                      closeMenuOnSelect={false}
                      isMulti
                      options={tagOptions}
                      onChange={selectedOptions => {
                        setSelectedTags(selectedOptions);
                        field.onChange(selectedOptions);
                      }}
                      value={selectedTags}
                      className={errors.tags ? 'is-invalid' : ''}
                    />
                  )}
                  control={control}
                />
                <InputGroup>
                  <div className="d-flex  flex-column gap-2">
                    <FormControl
                      placeholder="Enter a tag"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={handleAddTag}
                      style={{ width: '100%' }}
                    >
                      أضف Tag / هاشتاج
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

export default ProductTags;
