import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldArray, useFormContext } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import MultiSelect from 'components/common/MultiSelect';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../../../../../firebase';
const ProductPrgramTrack = () => {
  const [listAccommodation, setListAccommodation] = useState([]);
  const [listPlaces, setListContentPlaces] = useState([]);
  const {
    watch,
    formState: { errors }
  } = useFormContext();
  const initTracks = watch('tripProgramTrack') || [];
  const [tracks, setTracks] = useState(initTracks);
  const [track, setTrack] = useState({});

  function removePackage(index) {
    const newTracks = [...tracks];
    newTracks.splice(index, 1);
    setTracks(newTracks);
  }

  const tracksByDays = {};
  tracks.forEach(t => {
    const day = t.tripTrackDay;
    if (!tracksByDays[day]) {
      tracksByDays[day] = [];
    }
    tracksByDays[day].push(t);
  });

  const { control } = useFormContext();
  const { append } = useFieldArray({
    control,
    name: 'tripProgramTrack'
  });

  useEffect(() => {
    async function fetchListContent() {
      const db = getFirestore(app);

      //accommodation
      const querySnapshot = await getDocs(collection(db, 'accommodation'));
      const listAccommodation = querySnapshot.docs.map(doc => doc.data());
      setListAccommodation(listAccommodation);

      //places
      const querySnapshotPlaces = await getDocs(
        collection(db, 'placesWillVisit')
      );
      const listContent = querySnapshotPlaces.docs.map(doc => doc.data());
      setListContentPlaces(listContent);
    }
    fetchListContent();
  }, []);

  const placeOptions = listPlaces.map(p => {
    return { value: p.name, label: p.name, imgURL: p.imgURL };
  });

  const accommodationOptions = listAccommodation.map(acc => {
    return {
      value: {
        location: acc.location,
        hotel: acc.hotel,
        image: acc.imgURL
      },
      label: `${acc.location}/${acc.hotel}`
    };
  });

  const handleTrackAccommodationChange = selectedOptions => {
    setTrack({
      ...track,
      tripTrackDayAccommodation: selectedOptions
    });
  };
  return (
    <Card
      className={`mt-3 ${
        errors.tripProgramTrack ? 'border border-danger' : ''
      }`}
    >
      <Card.Header as="h6" className="bg-light fs-1">
        مسار الرحلة البرنامج
      </Card.Header>
      <hr style={{ display: tracks.length > 0 ? 'block' : 'hidden' }} />
      {Object.keys(tracksByDays).map((day, index) => (
        <div key={day} className="px-2">
          <h3>اليوم {day}</h3>
          {tracksByDays[day].map(track => (
            <div key={track.id}>
              <h4>{track.tripTrackDayTitle}</h4>
              <p>{track.tripTrackDayProgramDescription}</p>
              <p>
                الأماكن:{' '}
                {track.tripTrackDayPlaces.map(place => place.label).join(', ')}
              </p>
              <p>
                أماكن الإقامة:{' '}
                {track.tripTrackDayAccommodation
                  .map(accommodation => accommodation.label)
                  .join(', ')}
              </p>
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
            </div>
          ))}
          <hr style={{ display: tracks.length > 0 ? 'block' : 'hidden' }} />
        </div>
      ))}

      <Card.Body>
        <Row className="gx-2 gy-3">
          <Col md="12" className="mb-3">
            <Form.Group controlId="tripTrackDayNumber">
              <Form.Label>رقم اليوم:</Form.Label>
              <Form.Control
                type="number"
                name="tripTrackDayNumber"
                onChange={e => {
                  setTrack({ ...track, tripTrackDayNumber: e.target.value });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group controlId="tripTrackDayTitle">
              <Form.Label>عنوان رحلة اليوم:</Form.Label>
              <Form.Control
                type="text"
                onChange={e => {
                  setTrack({ ...track, tripTrackDayTitle: e.target.value });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group controlId="tripTrackDayDescription">
              <Form.Label>وصف رحلة اليوم:</Form.Label>
              <Form.Control
                type="text"
                onChange={e => {
                  setTrack({
                    ...track,
                    shortDescription: e.target.value
                  });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group controlId="tripTrackDayDescription">
              <Form.Label>برنامج رحلة اليوم:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={e => {
                  setTrack({
                    ...track,
                    tripTrackDayDescription: e.target.value
                  });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="12">
            <Form.Group controlId="tripTrackDayDescription">
              <Form.Label>أنشطة رحلة اليوم:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={e => {
                  setTrack({
                    ...track,
                    activities: e.target.value
                  });
                }}
              />
            </Form.Group>
          </Col>

          <Col xs="12">
            <Form.Label>أماكن سوف تزورها:</Form.Label>

            <MultiSelect
              closeMenuOnSelect={false}
              isMulti
              options={placeOptions}
              onChange={selectedOptions => {
                setTrack({ ...track, tripTrackDayPlaces: selectedOptions });
                //field.onChange(selectedOptions);
              }}
            />
          </Col>
          <Col xs="12">
            <Form.Label>أماكن الإقامة:</Form.Label>
            <MultiSelect
              closeMenuOnSelect={false}
              isMulti
              options={accommodationOptions}
              onChange={handleTrackAccommodationChange}
              value={track.tripTrackDayAccommodation} // Set the value of the MultiSelect component from the state
            />
          </Col>

          <Col xs="12">
            <Button
              style={{ width: '100%' }}
              variant="primary"
              onClick={() => {
                const currentPackage = {
                  tripTrackDay: track.tripTrackDayNumber,
                  tripTrackDayTitle: track.tripTrackDayTitle,
                  tripTrackDayProgramDescription: track.tripTrackDayDescription,
                  tripTrackDayPlaces: track.tripTrackDayPlaces,
                  tripTrackDayAccommodation: track.tripTrackDayAccommodation
                };
                setTracks([...tracks, currentPackage]);
                append(currentPackage);
              }}
            >
              إضافة المسار
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProductPrgramTrack;
