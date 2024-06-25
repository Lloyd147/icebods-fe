import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Category = 'PORTABLES' | 'BARRELS' | 'TUBS';

type InitialState = {
  backofficeCategory: Category;
  homeCategory: Category;
};

const initialState: InitialState = {
  backofficeCategory: 'PORTABLES',
  homeCategory: 'PORTABLES'
};

export const categorySlice = createSlice({
  name: 'categorySlice',
  initialState,
  reducers: {
    setHomeCategory: (state, action: PayloadAction<Category>) => {
      state.homeCategory = action.payload;
    },
    setBackOfficeCategory: (state, action: PayloadAction<Category>) => {
      state.backofficeCategory = action.payload;
    }
  }
});

export const { setHomeCategory, setBackOfficeCategory } = categorySlice.actions;

export default categorySlice.reducer;
