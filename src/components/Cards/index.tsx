import React from 'react';
import { OfferProps } from '../TabCardOpen';

const Card = (props: OfferProps) => {
  const { overview, dimensions, deliveryTime } = props.offer;
  return (
    <>
      <div className="card-container">
        <div className="container__info">
          <div className="row-1">
            <div className="black-font">Overview:</div>
            <div className="green-font">{overview ? overview : 'N/A'}</div>
          </div>
          <div className="row-1">
            <div className="black-font">Dimensions:</div>
            <div className="green-font">{dimensions ? dimensions : 'N/A'}</div>
          </div>
          <div className="row-1">
            <div className="black-font">Delivery time:</div>
            <div className="green-font">{deliveryTime ? deliveryTime : 'N/A'}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
