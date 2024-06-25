'use client';
import React, { useState } from 'react';
import Card from '../Cards/index';
import ReviewCard from '../ReviewCard/index';
import Toggle from '../Toggle/index';
import { Offer } from '../TabCards';

export interface OfferProps {
  offer: Offer;
}

const TabCardOpen = (props: OfferProps) => {
  const { offer } = props;
  const [active, setActive] = useState('info');
  const items = ['info', 'review'];

  return (
    <div className="offer-tab">
      <Toggle className={'small-toggle'} items={items} subItems={[]} active={active} setActive={setActive} />
      <div className="tab-open">
        <div className="open__info">
          {active == 'info' && <Card offer={offer} />}
          {active == 'review' && <ReviewCard offer={offer} />}
        </div>
      </div>
    </div>
  );
};

export default TabCardOpen;
