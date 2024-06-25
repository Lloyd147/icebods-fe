'use client';
import React, { useEffect, useState } from 'react';
import OddsForm from '../OddsForm';
import AdminOddsTable from '../AdminOddsTable';
import { Fixture } from '@/types/commonTypes';
import { useDispatch } from 'react-redux';
import { setEditId, setOdds } from '@/redux/features/fixturesFormSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { Offer } from '../TabCards';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';

interface AdminOddsProps {
  offers: Offer[];
}

const AdminOdds = ({ offers }: AdminOddsProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const editId = useSelector((state: RootState) => state.fixturesFormState.editId);
  const oddsFromState = useSelector((state: RootState) => state.fixturesFormState.odds);
  const token = getCookie('token');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (oddsFromState?.length === 0)
      axios
        .get(`${API_ENDPOINT}/odds`, {
          params: {
            pageNumber: 1,
            pageSize: 100,
            disabled: true
          }
        })
        .then((response: { data: { odds: Fixture[] } }) => {
          const odds = response?.data?.odds;
          dispatch(setOdds(odds));
        })
        .catch((error: any) => {
          console.log('Odds error: ', error);
        });
  }, []);

  useEffect(() => {
    editId ? setShowForm(true) : setShowForm(false);
  }, [editId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !token) router.push('/admin/login');
  }, []);

  const handleClick = () => {
    setShowForm(!showForm);
    dispatch(setEditId(''));
  };

  return (
    <div>
      <div className="wrapper">
        <div className="button-row">
          <h1>{showForm ? 'Add Odd' : 'All Odds'}</h1>
          <button onClick={handleClick}>{showForm ? 'Cancel' : 'Add New'}</button>
        </div>
      </div>
      {showForm ? (
        <OddsForm setShowForm={setShowForm} />
      ) : (
        <div className="table-data">
          <AdminOddsTable />
        </div>
      )}
    </div>
  );
};

export default AdminOdds;
