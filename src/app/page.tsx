import React from 'react';
import { API_ENDPOINT } from '../lib/constants';
import Offers from '@/components/Offers';

export default async function Home() {
  const res = await fetch(`${API_ENDPOINT}/portables?pageNumber=1&pageSize=100`, { cache: 'no-store' });
  const data = await res.json();
  const initialOffers = data.offers;

  return (
    <>
      <div className="nav_banner">
        <div className="nav_banner_heading">Best UK Ice Baths</div>
        <div className="nav_banner_para">IceBods – Rejuvenate. Recover. Repeat.</div>
      </div>
      <Offers initialOffers={initialOffers || []} />
    </>
  );
}
