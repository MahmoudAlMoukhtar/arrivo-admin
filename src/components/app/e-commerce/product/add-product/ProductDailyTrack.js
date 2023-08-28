import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldArray, useFormContext } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelect from 'components/common/MultiSelect';
import Flex from 'components/common/Flex';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../../../../../firebase';
const ProductDailyTrack = () => {
  const [tracks, setTracks] = useState([]);
  const [track, setTrack] = useState({});
  const [listPlaces, setListPlaces] = useState([]);

  function removePackage(index) {
    const newTracks = [...tracks];
    newTracks.splice(index, 1);
    setTracks(newTracks);
  }

  const { control } = useFormContext();
  const { append } = useFieldArray({
    control,
    name: 'tripProgramTrack'
  });
  useEffect(() => {
    async function fetchListContent() {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'placesWillVisit'));
      const listContent = querySnapshot.docs.map(doc => doc.data());
      setListPlaces(listContent);
    }
    fetchListContent();
  }, []);
  const placeOptions = listPlaces.map(p => {
    return { value: p.name, label: p.name, imgURL: p.imgURL };
  });

  return (
    <Card className="mt-3">
      <Card.Header as="h6" className="bg-light fs-1">
        مسار الرحلة اليومية
      </Card.Header>
      <hr style={{ display: tracks.length > 0 ? 'block' : 'hidden' }} />
      {tracks.map((t, i) => (
        <div key={i}>
          <Flex alignItems={'end'} justifyContent={'between'}>
            <h6 className="px-2">{t.tripTrackDayMainStation.name}</h6>
            <Button
              variant="link"
              to="#!"
              type="button"
              className="text-danger"
              size="sm"
              onClick={() => removePackage(i)}
            >
              <FontAwesomeIcon className="fs--1" icon="trash-alt" />
            </Button>
          </Flex>
          <ul>
            {t.tripTrackDaySubStations.map((s, i) => (
              <span key={i}>
                {s.value}
                {i < t.tripTrackDaySubStations.length - 1 ? ' , ' : '.'}
              </span>
            ))}
          </ul>
          <hr />
        </div>
      ))}
      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col xs="12">
            <Form.Label>المحطة الرئيسية:</Form.Label>
            <Form.Select
              onChange={e => {
                const selectedPlace = listPlaces.find(
                  place => place.name === e.target.value
                );
                setTrack({
                  ...track,
                  tripTrackDayMainStation: selectedPlace
                });
              }}
              value={track?.tripTrackDayMainStation?.name}
            >
              {listPlaces?.map((p, i) => (
                <option value={p.name} key={i}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
            {/*   <InputGroup xs={12} className="my-2">
              <FormControl
                type="text"
                value={inputMainStation}
                placeholder="Enter a sub station"
                onChange={e => {
                  setInputMainStation(e.target.Value);
                  setValue(`tripTrackDayMainStation`, e.target.Value);
                }}
              />
            </InputGroup> */}
          </Col>
          <Col xs="12">
            <Form.Label>المحطات الفرعية:</Form.Label>

            <MultiSelect
              closeMenuOnSelect={false}
              isMulti
              options={placeOptions}
              onChange={selectedOptions => {
                setTrack({
                  ...track,
                  tripTrackDaySubStations: selectedOptions
                });
              }}
            />
          </Col>

          <Col xs="12">
            <Button
              style={{ width: '100%' }}
              variant="primary"
              onClick={() => {
                const currentPackage = {
                  tripTrackDayMainStation: track.tripTrackDayMainStation,
                  tripTrackDaySubStations: track.tripTrackDaySubStations
                };
                setTracks([...tracks, currentPackage]);
                append(currentPackage);
              }}
            >
              إضافة مسار
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductDailyTrack;
