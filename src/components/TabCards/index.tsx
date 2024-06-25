'use client';
import React, { useEffect, useState } from 'react';

import TabCardOpen from '../TabCardOpen/index';
import { checkHTTPProtocol } from '@/lib/utils';
interface Logo {
  type?: string;
  cloudinaryId?: string;
  imageUrl?: string;
  _id?: string;
}

interface BuyLink {
  name: string;
  price: number | null;
  link: string;
}

export interface Offer {
  __v?: number;
  _id?: string;
  buyLink1: BuyLink;
  buyLink2: BuyLink;
  cons: string;
  deliveryTime: string;
  dimensions: string;
  enabled: boolean;
  infoImage: Logo;
  name: string;
  order?: number;
  overview: string;
  promoInfo: string;
  pros: string;
  rating: number | null;
  review: string;
  terms: string;
  index?: number;
}
interface Props {
  data: Offer;
}
const TabCard = (props: Props) => {
  const { data } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={isOpen ? 'tab_container opened' : 'tab_container'}>
      <div className="container__content">
        <div className="tab_sub-number">{data?.order}</div>

        <div className="name-section">
          <div className="offer-name">{data?.name}</div>
          <div className="tab_item_rate">
            <img src="/images/svg/star.svg"></img>
            <div className="tab_item_rate_text">
              {data?.rating}
              <span>/5.0</span>
            </div>
          </div>
        </div>

        <div className="tab_sub_container">
          <img src={data?.infoImage?.imageUrl} className="tab-container_img" />
          <div className="tab-container_info">
            <div className="info__name">
              <div className="info__buy">
                <div className="buy__info">
                  <div className="info__link">{data?.buyLink1?.name}</div>
                  <div className="info__price">£{data?.buyLink1?.price}</div>
                </div>
                <a className="buy-now-btn" href={checkHTTPProtocol(`${data?.buyLink1?.link}`)} target="blank">
                  BUY NOW
                </a>
              </div>
            </div>
            {data?.buyLink2?.name && (
              <div className="info__name">
                <div className="info__buy">
                  <div className="buy__info">
                    <div className="info__link">{data?.buyLink2?.name}</div>
                    <div className="info__price">£{data?.buyLink1?.price}</div>
                  </div>
                  <a className="buy-now-btn" href={checkHTTPProtocol(`${data?.buyLink2?.link}`)} target="blank">
                    BUY NOW
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="promo-info">{data?.promoInfo}</div>
        {isOpen && <TabCardOpen offer={data} />}
        <div className="tab_show" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Show less -' : 'Show more +'}
        </div>
      </div>
    </div>
  );
};

export default TabCard;
