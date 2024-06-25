import React from 'react';
import parse from 'html-react-parser';
import { OfferProps } from '../TabCardOpen';

const ReviewCard = (props: OfferProps) => {
  const { pros, cons } = props.offer;
  return (
    <>
      <div className="review_container">
        <div className="review_container_1">{pros && parse(pros)}</div>
        <div className="review_container-2">{cons && parse(cons)}</div>
      </div>
    </>
  );
};

export default ReviewCard;
