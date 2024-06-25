import { getDateForFilters } from '@/lib/utils';
import { Fixture } from '@/types/commonTypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Filters {
  day: { name: string; fullName: string; date: string };
  league: string;
  sortBy: string;
}

interface FixturesState {
  fixtures: Fixture[];
  filters: Filters;
}

const date = new Date();

const initialState: FixturesState = {
  fixtures: [],
  filters: {
    day: { name: 'TODAY', fullName: date.toLocaleDateString('en-GB', { weekday: 'long' }), date: getDateForFilters(date.toDateString()) },
    league: '*',
    sortBy: 'time'
  }
};

export const fixturesSlice = createSlice({
  name: 'fixturesState',
  initialState,
  reducers: {
    setFixtures: (state, action: PayloadAction<Fixture[]>) => {
      state.fixtures = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    }
  }
});

export const { setFixtures, setFilters } = fixturesSlice.actions;

export default fixturesSlice.reducer;
