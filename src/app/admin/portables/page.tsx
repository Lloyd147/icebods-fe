'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import Table from '@/components/Table/index';
import { Offer } from '@/components/TabCards/index';
import { getCookie } from '@/lib/cookies';
import { API_ENDPOINT } from '@/lib/constants';
import FormContainer from '@/components/FormContainer';
import PriceForm from '@/components/PriceForm';

const AdminOffers = () => {
  const [selectedId, setSelectedId] = useState('');
  const [addNew, setAddNew] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filterOffer, setFilterOffer] = useState<Offer>();
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);
  const { push } = useRouter();
  const pathname = usePathname();
  const category = pathname?.split('/')?.[2];

  const pageSize = 100;
  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      push('/admin/login');
    }
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      axios
        .get(`${API_ENDPOINT}/portables`, {
          params: {
            pageNumber,
            pageSize,
            disabled: true
          }
        })
        .then((response: { data: { offers: Offer[] } }) => {
          const newOffers = response?.data?.offers;

          if (newOffers.length === 0) {
            setHasMore(false);
          } else {
            setOffers([...offers, ...newOffers] as any);
          }
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error('Error fetching offers:', error);
          setIsLoading(false);
        });
    }
  }, [pageNumber]);

  const handleEdit = (id: string) => {
    if (id) {
      setAddNew(true);
      const filteredOffers = offers?.find((offer) => offer?._id === id);
      setFilterOffer(filteredOffers);
    }
  };

  const render = () => {
    if (token) {
      if (addNew)
        return (
          <FormContainer setIsOpen={setAddNew} setFilterOffer={setFilterOffer} filterOffer={filterOffer!} selectedId={selectedId} setOffers={setOffers} offers={offers} setSelectedId={setSelectedId} />
        );
      if (showPriceForm) return <PriceForm category={category} setShowPriceForm={setShowPriceForm} />;
      return (
        <>
          <div className="wrapper">
            <div className="button-row">
              <h1>Basic</h1>
              <div className="row__btn-group">
                <button onClick={() => setShowPriceForm(true)}>Update Price Range</button>
                <button
                  onClick={() => {
                    selectedId == '' && setAddNew(true);
                  }}
                >
                  Add New
                </button>
              </div>
            </div>
          </div>
          <div className="table-data">
            <Table
              offers={offers}
              isLoading={isLoading}
              loadMoreOffers={loadMoreOffers}
              hasMore={hasMore}
              setOffers={setOffers}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              handleEdit={handleEdit}
            />
          </div>
        </>
      );
    }
  };

  return render();
};

export default AdminOffers;
