import React from 'react';
import CustomSelect, { Option } from '../CustomSelect';
import BetsList from '../BetsList';
import { useDispatch } from 'react-redux';
import { setFilters } from '@/redux/features/fixturesSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { sortingOptions } from '@/lib/constants';
import DayFilter from '../DayFilter';
import { getDateForFilters, getLeagueOptions } from '@/lib/utils';

const BetsSection = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state: RootState) => state.fixturesState.filters);
  const allFixtures = useSelector((state: RootState) => state.fixturesState.fixtures);
  const filterFixtures = allFixtures.filter((item) => getDateForFilters(item.eventDateTime) === currentFilters.day.date);
  const leagueOptions = getLeagueOptions(filterFixtures);

  const handleCompetitionChange = (option: Option) => {
    dispatch(setFilters({ ...currentFilters, league: option.value }));
  };

  const handleSortChange = (option: Option) => {
    dispatch(setFilters({ ...currentFilters, sortBy: option.value }));
  };

  return (
    <div className="bets-section">
      <div className="filters">
        <DayFilter />
        <div className="filters__competition">
          <CustomSelect className="competition__game" label="League" options={leagueOptions} defaultValue={leagueOptions[0]} expandedOptions={true} onChange={handleCompetitionChange} />
          <CustomSelect className="competition__time" label="Sort by" options={sortingOptions} defaultValue={sortingOptions[0]} onChange={handleSortChange} />
        </div>
      </div>
      <BetsList />
    </div>
  );
};

export default BetsSection;
