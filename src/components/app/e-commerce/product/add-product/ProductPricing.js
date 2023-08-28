import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldArray, useFormContext } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Flex from 'components/common/Flex';
import { Timestamp } from 'firebase/firestore';

const ProductPricing = () => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();
  let initPackages = watch('tripPackages') || [];

  const [packages, setPackages] = useState(initPackages);
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(date.setDate(date.getDate() + 7))
  );
  const [releaseDate, setReleaseDate] = useState(startDate);

  const { append } = useFieldArray({
    control,
    name: 'tripPackages'
  });

  const { regularPrice } = watch();

  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const release = new Date(
      start.getTime() + diffInDays * 24 * 60 * 60 * 1000
    );
    setReleaseDate(release);
  };

  function removePackage(index) {
    const newPackages = [...packages];
    newPackages.splice(index, 1);
    setPackages(newPackages);
  }

  const packagesByPersons = {};
  packages.forEach(p => {
    const persons = p.personsCount;
    if (!packagesByPersons[persons]) {
      packagesByPersons[persons] = [];
    }
    let startDateStr = '';
    let endDateStr = '';
    // Check if startDate and endDate are Firestore Timestamp objects
    const isStartDateTimestamp = p.startDate instanceof Timestamp;
    const isEndDateTimestamp = p.endDate instanceof Timestamp;

    if (isStartDateTimestamp && isEndDateTimestamp) {
      // Convert start and end timestamps to Date objects
      const startDateObj = p.startDate.toDate();
      const endDateObj = p.endDate.toDate();

      // Format dates as strings
      startDateStr = startDateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      endDateStr = endDateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      // startDate and/or endDate is not a Firestore Timestamp object
      // Assume they are already in the desired format
      startDateStr = p.startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      endDateStr = p.endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    packagesByPersons[persons].push({
      ...p,
      startDate: startDateStr,
      endDate: endDateStr
    });
  });

  return (
    <Card
      className={`mt-3 ${errors.tripPackages ? 'border border-danger' : ''}`}
    >
      <Card.Header as="h6" className="bg-light fs-1">
        بكجات الأسعار
      </Card.Header>
      <hr />
      {Object.entries(packagesByPersons).map(([persons, packages]) => (
        <div key={persons} style={{ padding: '10px' }}>
          <h5>
            {persons > 2 ? `${persons} أشخاص` : persons == 2 ? 'شخصين' : 'شخص'}
          </h5>
          {packages.map((p, index) => {
            return (
              <Row key={index} className="gx-2 flex-between-center mb-3">
                <Col sm={3}>
                  <h6 className="mb-0 text-600">
                    {p.startDate} - {p.endDate}
                  </h6>
                </Col>
                <Col sm={9}>
                  <Flex
                    justifyContent="between"
                    alignItems="center"
                    padding="10px"
                    flexDirection="column"
                  >
                    <h6 className="mb-0 text-700">
                      Price:{p.finalPrice} {watch('currency')}
                    </h6>
                    <h6 className="mb-0 text-700">
                      Discount: {p.discountPercentage}%
                    </h6>
                    <h6 className="mb-0 text-700">Persons: {p.personsCount}</h6>
                    <Button
                      variant="link"
                      to="#!"
                      type="button"
                      className="text-danger"
                      size="sm"
                      onClick={() => removePackage(index)}
                    >
                      <FontAwesomeIcon className="fs--1" icon="trash-alt" />
                    </Button>
                  </Flex>
                </Col>
              </Row>
            );
          })}
          <hr />
        </div>
      ))}
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col md="12" className="mb-3">
            <Form.Group controlId="personsCount">
              <Form.Label>عدد الأشخاص:</Form.Label>
              <Form.Control
                type="number"
                name="personsCount"
                {...register('personsCount')}
              />
            </Form.Group>
          </Col>
          <Col xs="8">
            <Form.Group controlId="regularPrice">
              <Form.Label>
                السعر الأساسي:
                <OverlayTrigger
                  overlay={
                    <Tooltip
                      style={{ position: 'fixed' }}
                      id="basePriceTooltip"
                    >
                      سعر الرحلة العادي
                    </Tooltip>
                  }
                >
                  <span className="ms-2 text-primary fs--1">
                    <FontAwesomeIcon icon="question-circle" />
                  </span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="number"
                {...register('regularPrice', {
                  onChange: e => setValue('finalPrice', e.target.value)
                })}
                isInvalid={!!errors.regularPrice}
              />
              <Form.Control.Feedback type="invalid">
                {errors.regularPrice?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs="4">
            <Form.Group>
              <Form.Label>Currency:</Form.Label>
              <Form.Select {...register(`currency`)}>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="cad">CAD</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md="12" className="mb-3">
            <Form.Group controlId="discountPercentage">
              <Form.Label>الخصم بالنسبة المئوية:</Form.Label>
              <Form.Control
                type="text"
                name="discountPercentage"
                {...register('discountPercentage', {
                  onChange: e => {
                    const calculatedPrice =
                      regularPrice - regularPrice * (e.target.value / 100);
                    setValue(
                      'finalPrice',
                      calculatedPrice >= 0 ? calculatedPrice : 0
                    );
                  }
                })}
              />
            </Form.Group>
          </Col>

          <Col xs="6">
            <Form.Group controlId="releaseDate">
              <Form.Label>تاريخ التوفر من والى:</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                dateFormat="MMM dd"
                className="form-control"
                renderExtraHeader={() => (
                  <div>
                    تاريخ التوفر:{' '}
                    {releaseDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              />
            </Form.Group>
          </Col>
          <Col xs="6">
            <Form.Group controlId="finalPrice">
              <Form.Label>
                السعر النهائي بعد حساب الخصم:
                <OverlayTrigger
                  overlay={
                    <Tooltip
                      style={{ position: 'fixed' }}
                      id="finalPriceTooltip"
                    >
                      *سعر الرحلة النهائي/تأكد من تطبيق الخصم
                    </Tooltip>
                  }
                >
                  <span className="ms-2 text-primary fs--1">
                    <FontAwesomeIcon icon="question-circle" />
                  </span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                type="number"
                readOnly
                {...register('finalPrice')}
                isInvalid={!!errors.finalPrice}
              />
              <Form.Control.Feedback type="invalid">
                {errors.finalPrice?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs="12">
            <Button
              style={{ width: '100%' }}
              variant="primary"
              onClick={() => {
                const currentPackage = {
                  finalPrice: watch('finalPrice'),
                  discountPercentage: watch('discountPercentage'),
                  startDate: startDate,
                  endDate: endDate,
                  personsCount: watch('personsCount')
                };
                setPackages([...packages, currentPackage]);
                append(currentPackage);
              }}
            >
              إضافة البكج
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductPricing;
