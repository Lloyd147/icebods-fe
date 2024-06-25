'use client';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { getCookie } from '@/lib/cookies';
import { Offer } from '@/components/TabCards/index';
import ImageUploader from '@/components/ImageUploader';
import { API_ENDPOINT } from '@/lib/constants';
import { usePathname } from 'next/navigation';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterOffer: Offer;
  selectedId: string;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  setFilterOffer: React.Dispatch<React.SetStateAction<any>>;
  offers: Offer[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Bookie is required'),
  promoInfo: Yup.string().max(20).required('Promo info is required'),
  rating: Yup.number().min(0).max(5).required('Rating is required'),
  buyLink1: Yup.object().shape({
    name: Yup.string().required('This field is required'),
    price: Yup.number().required('This field is required'),
    link: Yup.string().required('This field is required')
  })
});

const initialValues: Offer = {
  buyLink1: { name: '', price: null, link: '' },
  buyLink2: { name: '', price: null, link: '' },
  cons: '',
  deliveryTime: '',
  dimensions: '',
  enabled: true,
  infoImage: {},
  name: '',
  overview: '',
  promoInfo: '',
  pros: '',
  rating: null,
  review: '',
  terms: ''
};

const getFormData = (data: Offer) => {
  const { __v, _id, ...rest } = data;
  return rest;
};

const FormContainer = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const { setIsOpen, filterOffer, selectedId, setFilterOffer, offers, setSelectedId, setOffers } = props;
  const pathname = usePathname();
  const category = pathname?.split('/')?.[2];

  const [active, setActive] = useState('key');
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);

  const resetStates = () => {
    setIsOpen(false);
    setSelectedId('');
    setFilterOffer({});
    setLoading(false);
  };
  const { setValues, values, errors, handleChange, setFieldValue, resetForm, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      updateOffer(values);
    }
  });

  const updateOffer = (values: Offer) => {
    const formData = new FormData();
    const headers = {
      'x-auth-token': token,
      'Content-Type': 'multipart/form-data'
    };

    if ((values.infoImage as any)?.type) {
      formData.append('infoImage', values.infoImage as Blob);
    }

    const editId = selectedId || '';
    const changedValues = {};
    if (editId) {
      if (filterOffer.enabled !== values.enabled) formData.append('enabled', `${values.enabled}`);
      Object.keys(values).forEach((key) => {
        if ((values as any)[key] !== (filterOffer as any)[key]) {
          (changedValues as any)[key] = (values as any)[key];
        }
      });

      const appendedFieldNames = ['enabled', 'infoImage'];

      Object.keys(changedValues).forEach((fieldName) => {
        if ((changedValues as any)[fieldName] && !appendedFieldNames.includes(fieldName)) {
          if (typeof (changedValues as any)[fieldName] === 'object') formData.append(fieldName, JSON.stringify((changedValues as any)[fieldName]));
          else formData.append(fieldName, (changedValues as any)[fieldName]);
        }
      });

      if ([...(formData as any).entries()].length > 0) {
        setLoading(true);
        axios
          .put(`${API_ENDPOINT}/${category}/${editId}`, formData, { headers })
          .then((response: { data: Offer }) => {
            const { data } = response;
            resetForm();
            const offersCopy = [...offers];
            const index = offersCopy?.findIndex((item) => item?._id === editId);

            if (index !== -1) {
              offersCopy[index] = { ...offersCopy[index], ...data };
              setOffers(offersCopy);
              toast.success('Updated');
            }
            resetStates();
          })
          .catch((error: any) => {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong');
            resetStates();
          });
      } else resetStates();
    } else {
      const appendedFieldNames = ['enabled', 'infoImage'];
      formData.append('enabled', `${values.enabled}`);

      Object.keys(values).forEach((fieldName) => {
        if ((values as any)[fieldName] && !appendedFieldNames.includes(fieldName)) {
          if (typeof (values as any)[fieldName] === 'object') formData.append(fieldName, JSON.stringify((values as any)[fieldName]));
          else formData.append(fieldName, (values as any)[fieldName]);
        }
      });

      setLoading(true);
      axios
        .post(`${API_ENDPOINT}/${category}/`, formData, { headers })
        .then((response: { data: Offer }) => {
          resetForm();
          toast.success('Added');
          const offersCopy = [...offers];
          offersCopy.push(response.data);
          setOffers(offersCopy);
          resetStates();
        })
        .catch((error: any) => {
          console.error('Error submitting form:', error);
          toast.error('Something went wrong');
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (selectedId) setValues(getFormData(filterOffer));
  }, [selectedId]);

  const modules = {
    toolbar: [{ list: 'bullet' }, { list: 'unordered' }]
  };

  const formats = ['list', 'bullet'];

  return (
    <>
      <div className="wrapper">
        <div className="form-header">
          <h1 className="form-heading">{selectedId ? 'Edit Offer' : 'Add New Offer'}</h1>
          <button className="back-btn" onClick={resetStates}>
            Cancel
          </button>
        </div>
      </div>
      <>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="flex">
            <div className="form-group">
              <label htmlFor="rating">Rating:*</label>
              <input type="number" onChange={handleChange} id="rating" name="rating" value={values.rating || ''} min={0} max={5} step={0.1} />
              {errors?.rating && <div className="error-message">{errors?.rating}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="name">Item:*</label>
              <input type="text" onChange={handleChange} id="name" name="name" value={values.name} />
              {errors?.name && <div className="error-message">{errors?.name}</div>}
            </div>
          </div>
          <div className="form-group-promo">
            <label htmlFor="promoInfo">Promo info:*</label>
            <input maxLength={20} type="text" onChange={handleChange} id="promoInfo" name="promoInfo" value={values.promoInfo || ''} />
            <div className="input-length">{values.promoInfo.length}/20</div>
            {errors?.promoInfo && <div className="error-message">{errors?.promoInfo}</div>}
          </div>
          <div className="buy-link">
            <div className="flex">
              <div className="flex-1">
                <div>
                  <label className="group-heading">Buy now link 1:*</label>
                  <div className="flex">
                    <div className="form-group">
                      <div className="small-input">
                        <label className="label-small" htmlFor="buyLink1.name">
                          Name*:{' '}
                        </label>
                        <input type="text" onChange={handleChange} id="buyLink1.name" name="buyLink1.name" value={values.buyLink1.name} />
                      </div>
                      {errors.buyLink1?.name && <div className="error-message">{errors?.buyLink1?.name}</div>}
                    </div>
                    <div className="form-group">
                      <div className="small-input">
                        <label className="label-small" htmlFor="buyLink1.price">
                          Price*:{' '}
                        </label>
                        <input type="number" onChange={handleChange} id="buyLink1.price" name="buyLink1.price" value={values.buyLink1.price!} />
                      </div>
                      {errors.buyLink1?.price && <div className="error-message">{errors?.buyLink1?.price}</div>}
                    </div>
                  </div>
                  <div>
                    <div className="small-input">
                      <label className="label-small" htmlFor="buyLink1.price">
                        Link*:{' '}
                      </label>
                      <input type="text" onChange={handleChange} id="buyLink1.link" name="buyLink1.link" value={values.buyLink1.link} />
                    </div>
                    {errors.buyLink1?.link && <div className="error-message">{errors?.buyLink1?.link}</div>}
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <label className="group-heading">Buy now link 2:</label>
                  <div className="flex">
                    <div className="form-group">
                      <div className="small-input">
                        <label className="label-small" htmlFor="buyLink2.name">
                          Name:{' '}
                        </label>
                        <input type="text" onChange={handleChange} id="buyLink2.name" name="buyLink2.name" value={values.buyLink2.name} />
                      </div>
                      {errors.buyLink2?.name && <div className="error-message">{errors?.buyLink2?.name}</div>}
                    </div>
                    <div className="form-group">
                      <div className="small-input">
                        <label className="label-small" htmlFor="buyLink2.price">
                          Price:{' '}
                        </label>
                        <input type="number" onChange={handleChange} id="buyLink2.price" name="buyLink2.price" value={values.buyLink2.price!} />
                      </div>
                      {errors.buyLink2?.price && <div className="error-message">{errors?.buyLink2?.price}</div>}
                    </div>
                  </div>
                  <div>
                    <div className="small-input">
                      <label className="label-small" htmlFor="buyLink2.price">
                        Link:{' '}
                      </label>
                      <input type="text" onChange={handleChange} id="buyLink2.link" name="buyLink2.link" value={values.buyLink2.link} />
                    </div>
                    {errors.buyLink2?.link && <div className="error-message">{errors?.buyLink2?.link}</div>}
                  </div>
                </div>
              </div>

              <div className="item-image">
                <label>Image:</label>
                <ImageUploader
                  name="infoImage"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('infoImage', event.currentTarget.files![0]);
                  }}
                  preview={filterOffer?.infoImage?.imageUrl}
                />
              </div>
            </div>
          </div>

          <div className="buttons">
            <div className="review-button" onClick={() => setActive('key')} style={{ border: `${active === 'key' ? '3px solid green' : '2px solid black'}` }}>
              Add Key Info
            </div>
            <div className="review-button" onClick={() => setActive('review')} style={{ border: `${active === 'review' ? '3px solid green' : '2px solid black'}` }}>
              Add Review
            </div>
          </div>
          {active === 'review' && (
            <>
              <div className="review-block">
                <div className="quill-input-1">
                  <label>Pros:</label>
                  <ReactQuill
                    placeholder="Enter the content of the Pros*"
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(content: string) => setFieldValue('pros', content)}
                    value={values.pros}
                  />
                </div>

                <div className="quill-input-1">
                  <label>Cons:</label>
                  <ReactQuill
                    placeholder="Enter the content of the cons*"
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(content: string) => setFieldValue('cons', content)}
                    value={values.cons}
                  />
                </div>
              </div>
              <div className="quill-input">
                <label>Review:</label>
                <ReactQuill placeholder="Enter the content of the review*" theme="snow" onChange={(content: string) => setFieldValue('review', content)} value={values.review} />
              </div>
            </>
          )}
          {active === 'key' && (
            <div className="quill-input">
              <div className="key-info-inputs">
                <div className="inputs__group">
                  <div className="group__input">
                    <label>Overview:</label>
                    <input type="text" onChange={handleChange} id="overview" name="overview" value={values.overview} />
                  </div>
                  <div className="group__input">
                    <label>Dimensions:</label>
                    <input type="text" onChange={handleChange} id="dimensions" name="dimensions" value={values.dimensions} />
                  </div>
                  <div className="group__input">
                    <label>Delivery time:</label>
                    <input type="text" onChange={handleChange} id="deliveryTime" name="deliveryTime" value={values.deliveryTime} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="enable-check">
            <input type="checkbox" name="enabled" id="enabled" checked={values.enabled} onChange={handleChange} />
            <label htmlFor="enabled">Enabled</label>
          </div>
          <button type="submit" className="save-button" style={{ pointerEvents: loading ? 'none' : 'all' }}>
            {!loading ? 'Save' : <img className="save-loader" src="/images/loading.gif" alt="" />}
          </button>
        </form>
      </>
    </>
  );
};

export default FormContainer;
