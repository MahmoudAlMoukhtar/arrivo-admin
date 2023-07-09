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

const ProductPricing = () => {
  const date = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(date.setDate(date.getDate() + 7))
  );
  const [releaseDate, setReleaseDate] = useState(startDate);
  const [packages, setPackages] = useState([]);

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

  const packagesByMonth = {};
  packages.forEach(p => {
    const month = p.startDate.getMonth() + 1;
    if (!packagesByMonth[month]) {
      packagesByMonth[month] = [];
    }
    packagesByMonth[month].push(p);
  });

  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tripPackages'
  });

  const { regularPrice } = watch();

  //register('packages');

  return (
    <Card className="mt-3">
      <Card.Header as="h6" className="bg-light fs-1">
        Pricing Packages
      </Card.Header>
      <hr />
      {Object.entries(packagesByMonth).map(([month, packages]) => (
        <div key={month} style={{ padding: '10px' }}>
          <h5>Month {month}</h5>
          {packages.map((p, index) => (
            <Row key={index} className="gx-2 flex-between-center mb-3">
              <Col sm={3}>
                <h6 className="mb-0 text-600">
                  {p.startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}{' '}
                  -{' '}
                  {p.endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
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
          ))}
        </div>
      ))}
      <hr />
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="8">
            <Form.Group controlId="regularPrice">
              <Form.Label>
                Base Price:
                <OverlayTrigger
                  overlay={
                    <Tooltip
                      style={{ position: 'fixed' }}
                      id="basePriceTooltip"
                    >
                      Product regular price
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
              <Form.Label>Discount in percentage:</Form.Label>
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
          <Col md="6" className="mb-3">
            <Form.Group controlId="personsCount">
              <Form.Label>Persons Count:</Form.Label>
              <Form.Control
                type="number"
                name="personsCount"
                {...register('personsCount')}
              />
            </Form.Group>
          </Col>
          <Col xs="6">
            <Form.Group controlId="releaseDate">
              <Form.Label>Release Date:</Form.Label>
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
                    Release Date:{' '}
                    {releaseDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              />
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group controlId="finalPrice">
              <Form.Label>
                Final price:
                <OverlayTrigger
                  overlay={
                    <Tooltip
                      style={{ position: 'fixed' }}
                      id="finalPriceTooltip"
                    >
                      Product final price
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
              Add Package
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductPricing;
/* 
const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // calculate the difference in days and round up
    const release = new Date(
      start.getTime() + diffInDays * 24 * 60 * 60 * 1000
    ); // add the difference in days to the start date
    setReleaseDate(release);
    setValue('releaseDate', release); // register the release date in the form state
  };

  <Form.Group controlId="releaseDate">
              <Form.Label>Release Date:</Form.Label>
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
                    Release Date:{' '}
                    {releaseDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              />
            </Form.Group>
*/
