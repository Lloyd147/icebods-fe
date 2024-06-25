import { configureStore } from '@reduxjs/toolkit';
import fixturesSlice from './features/fixturesSlice';
import betslipSlice from './features/betslipSlice';
import fixturesFormSlice from './features/fixturesFormSlice';
import bookiesSlice from './features/bookiesSlice';
import bonusSlice from './features/bonusSlice';
import categorySlice from './features/categorySlice';

export const store = configureStore({
  reducer: {
    bookiesState: bookiesSlice,
    bonusState: bonusSlice,
    fixturesState: fixturesSlice,
    betSlipState: betslipSlice,
    fixturesFormState: fixturesFormSlice,
    categorySlice: categorySlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
