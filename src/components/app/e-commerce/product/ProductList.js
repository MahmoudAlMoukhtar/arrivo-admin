import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductSingleImage } from './ProductImage';
import StarRating from 'components/common/StarRating';
import Flex from 'components/common/Flex';
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where
} from 'firebase/firestore';
import app from '../../../../firebase';
import { ProductContext } from 'context/Context';

const ProductList = ({ product, index, setCopiedProduct, setEdit }) => {
  const {
    id,
    productName: name,
    tripCategory: category,
    //id,
    mostPlacesWillVisit,
    tripPackages,
    salePrice,
    shippingCost,
    productSummery,
    // rating,
    // totalReview,
    isInStock,
    // isNew,
    thumTripImge: file
  } = product;
  const navigait = useNavigate();
  const {
    //productsState: { products },
    productsDispatch
  } = useContext(ProductContext);
  return (
    <React.Fragment>
      <Col
        xs={12}
        className={classNames('p-x1', {
          'bg-100': index % 2 !== 0
        })}
      >
        <Row>
          <Col sm={5} md={4}>
            {/* <ProductImage
              name={name}
              id={id}
              isNew={isNew}
              files={files}
              layout="list"
            /> */}
            <ProductSingleImage
              id={id}
              image={file}
              name={name}
              layout={'list'}
            />
          </Col>
          <Col sm={7} md={8}>
            <Row className="h-100">
              <Col lg={8}>
                <h5 className="mt-3 mt-sm-0">
                  <Link
                    to={`/e-commerce/product/product-details/id`}
                    className="text-dark fs-0 fs-lg-1"
                  >
                    {name}
                  </Link>
                </h5>
                <p className="fs--1 mb-2 mb-md-3">
                  <Link to="#!" className="text-500">
                    {category}
                  </Link>
                </p>
                <ul className="list-unstyled d-none d-lg-block">
                  {mostPlacesWillVisit.map(place => (
                    <li key={place.value}>
                      <FontAwesomeIcon icon="circle" transform="shrink-12" />
                      <span>{place.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="fs--1 mb-2 mb-md-3">{productSummery}</p>
              </Col>
              <Col lg={4} as={Flex} justifyContent="between" direction="column">
                <div>
                  <h4 className="fs-1 fs-md-2 text-warning mb-0">
                    {`$${salePrice ? salePrice : tripPackages[0].finalPrice}`}
                  </h4>
                  {salePrice && (
                    <h5 className="fs--1 text-500 mb-0 mt-1">
                      <del>{`$${tripPackages[0].finalPrice}`}</del>
                      <span className="ms-2">
                        -{tripPackages[0].discountPercentage}%
                      </span>
                    </h5>
                  )}
                  <div className="mb-2 mt-3">
                    <StarRating readonly rating={4.5} />
                    {/* <span className="ms-1">({totalReview})</span> */}
                    <span className="ms-1">({4.5})</span>
                  </div>
                  <div className="d-none d-lg-block">
                    <p className="fs--1 mb-1">
                      Shipping Cost: <strong>{`$${shippingCost}`}</strong>
                    </p>
                    <p className="fs--1 mb-1">
                      Stock:{' '}
                      <strong
                        className={classNames({
                          'text-success': isInStock,
                          'text-danger': !isInStock
                        })}
                      >
                        {isInStock ? 'Available' : 'Stock-Out'}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant={'outline-secondary'}
                    className={classNames('d-lg-block me-2 me-lg-0 w-lg-100')}
                    onClick={() => {
                      setCopiedProduct(product);
                      setEdit(false);
                      navigait('/e-commerce/product/add-product');
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="d-lg-block my-2 mt-lg-2 w-lg-100"
                    onClick={() => {
                      setCopiedProduct(product);
                      setEdit(true);
                      navigait('/e-commerce/product/add-product');
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="d-lg-block-lg-2 w-lg-100"
                    onClick={async () => {
                      const db = getFirestore(app);
                      const tripsRef = collection(db, 'trips');

                      // Query the document by ID and limit to one
                      const q = query(
                        tripsRef,
                        where('id', '==', id),
                        limit(1)
                      );

                      try {
                        const querySnapshot = await getDocs(q);

                        if (!querySnapshot.empty) {
                          const docSnapshot = querySnapshot.docs[0];
                          await deleteDoc(docSnapshot.ref);
                          productsDispatch({
                            type: 'REMOVE_PRODUCT',
                            payload: {
                              productId: id
                            }
                          });
                          console.log('Trip deleted successfully');
                        } else {
                          console.log('Trip not found');
                        }
                      } catch (error) {
                        console.error('Error deleting trip:', error);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </React.Fragment>
  );
};

ProductList.propTypes = {
  product: PropTypes.shape({
    productName: PropTypes.string.isRequired,
    productSummery: PropTypes.string.isRequired,
    tripCategory: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    mostPlacesWillVisit: PropTypes.array,
    tripPackages: PropTypes.array.isRequired,
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shippingCost: PropTypes.number,
    rating: PropTypes.number,
    totalReview: PropTypes.number,
    isInStock: PropTypes.bool,
    isNew: PropTypes.bool,
    thumTripImge: PropTypes.string.isRequired
    //files: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  setCopiedProduct: PropTypes.func,
  setEdit: PropTypes.func,
  index: PropTypes.number
};

export default ProductList;
