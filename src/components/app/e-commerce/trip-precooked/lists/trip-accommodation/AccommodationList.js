import React, { useEffect, useState } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import CardDropdown from 'components/common/CardDropdown';
import AccommodationTableHeader from './AccommodationTableHeader';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTablePagination from 'components/common/advance-table/AdvanceTablePagination';
import CotainerFormAccommodation from '../../create-new/trip-accommodation-form/CotainerFormAccommodation';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../../../../../../firebase';

const columns = [
  {
    accessor: 'imgURL',
    Header: 'Image',
    headerProps: { className: 'pe-4' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { imgURL } = rowData.row.original;
      return (
        <React.Fragment>
          <img src={imgURL} width={50} height={50} />
        </React.Fragment>
      );
    }
  },
  {
    accessor: 'location',
    Header: 'Location',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { location } = rowData.row.original;
      return (
        <React.Fragment>
          <strong>{location}</strong>
        </React.Fragment>
      );
    }
  },
  {
    accessor: 'hotel',
    Header: 'Hotel',
    headerProps: { className: 'pe-1' },
    cellProps: {
      className: 'py-2'
    },
    Cell: rowData => {
      const { hotel } = rowData.row.original;
      return (
        <React.Fragment>
          <strong>{hotel}</strong>
        </React.Fragment>
      );
    }
  },

  {
    accessor: 'date',
    Header: 'Date',
    headerProps: { className: 'pe-7' },
    Cell: rowData => {
      const { date: timestamp } = rowData.row.original;
      const dateCorrect = new Date(timestamp);

      const correctFormatDate = dateCorrect.toLocaleString();
      return <React.Fragment>{correctFormatDate}</React.Fragment>;
    }
  },
  {
    accessor: 'none',
    Header: '',
    disableSortBy: true,
    cellProps: {
      className: 'text-end'
    },
    Cell: () => {
      return (
        <CardDropdown>
          <div className="py-2">
            {/* 
            <Dropdown.Item href="#!">Completed</Dropdown.Item>
            <Dropdown.Item href="#!">Processing</Dropdown.Item>
            <Dropdown.Item href="#!">On Hold</Dropdown.Item>
            <Dropdown.Item href="#!">Pending</Dropdown.Item> 
            <Dropdown.Divider as="div" />
          */}
            <Dropdown.Item href="#!" className="text-danger">
              Delete
            </Dropdown.Item>
          </div>
        </CardDropdown>
      );
    }
  }
];

const AccommodationList = () => {
  const [listContent, setListContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchListContent() {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'accommodation'));
      const listContent = querySnapshot.docs.map(doc => doc.data());
      setListContent(listContent);
    }
    fetchListContent();
  }, [loading]);
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error!!!</h2>;
  return (
    <AdvanceTableWrapper
      columns={columns}
      data={listContent}
      selection
      sortable
      pagination
      perPage={10}
    >
      <Card className="mb-3">
        <Card.Header>
          <AccommodationTableHeader table />
        </Card.Header>
        <Card.Body className="p-0">
          <AdvanceTable
            table
            headerClassName="bg-200 text-900 text-nowrap align-middle"
            rowClassName="align-middle white-space-nowrap"
            tableProps={{
              size: 'sm',
              striped: true,
              className: 'fs--1 mb-0 overflow-hidden'
            }}
          />
        </Card.Body>
        <Card.Footer>
          <AdvanceTablePagination table />
        </Card.Footer>
      </Card>
      <Card>
        <CotainerFormAccommodation
          setLoading={setLoading}
          setError={setError}
        />
      </Card>
    </AdvanceTableWrapper>
  );
};

export default AccommodationList;
