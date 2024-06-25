import { API_ENDPOINT } from '@/lib/constants';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PriceRanges } from '../Offers';
import { getCookie } from '@/lib/cookies';

interface PriceFormProps {
  category: string;
  setShowPriceForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PriceForm = ({ category, setShowPriceForm }: PriceFormProps) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_ENDPOINT}/price-range`)
      .then((response: { data: PriceRanges }) => {
        const range = response?.data?.[category as keyof PriceRanges];
        setValue(range);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log('price-range error: ', error);
        handleReset();
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const headers = {
      'x-auth-token': token
    };
    const body = { [category]: value };
    setSaving(true);
    axios
      .put(`${API_ENDPOINT}/price-range`, body, { headers })
      .then(() => {
        toast.success('updated');
        handleReset();
      })
      .catch((error: any) => {
        console.log('price-range error: ', error);
        toast.error('Something went wrong');
        setSaving(false);
      });
  };

  const handleReset = () => {
    setValue('');
    setShowPriceForm(false);
    setLoading(false);
    setSaving(false);
  };

  return (
    <>
      <div className="wrapper">
        <div className="form-header">
          <h1 className="form-heading">Update Price Range</h1>
          <button className="back-btn" onClick={handleReset}>
            Cancel
          </button>
        </div>
      </div>
      <form className="form-container" onSubmit={handleSubmit}>
        {loading ? (
          <div className="loader-gif">
            <img src="/images/loading.gif" alt="" />
          </div>
        ) : (
          <>
            <div className="form-group-promo">
              <label htmlFor="promoInfo" style={{ marginBottom: '20px', textTransform: 'capitalize' }}>{`${category} price range:`}</label>
              <input type="text" value={value} onChange={handleChange} />
            </div>
            <button type="submit" className="save-button" style={{ pointerEvents: loading ? 'none' : 'all' }}>
              {!saving ? 'Save' : <img className="save-loader" src="/images/loading.gif" alt="" />}
            </button>
          </>
        )}
      </form>
    </>
  );
};

export default PriceForm;
