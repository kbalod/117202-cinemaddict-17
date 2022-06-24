import dayjs from 'dayjs';
import {MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH,FilterType,ProfileRating} from '../const';

export const formatDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH)}...` : description;

const more = (a,b) => (a < b) ? 1 : -1;
export const sortByRating = (taskA, taskB) => {
  const a = taskA.filmsInfo.totalRating;
  const b = taskB.filmsInfo.totalRating;
  return more(a,b);
};
export const sortByDate = (taskA, taskB) => {
  const a = taskA.filmsInfo.release.date;
  const b = taskB.filmsInfo.release.date;
  return dayjs(b).diff(dayjs(a));
};

export const getProfileRating = (item) => {
  if (item >= ProfileRating.MOVIE_BUFF) {
    return 'Movie Buff';
  } else if (item >= ProfileRating.FAN && item < ProfileRating.MOVIE_BUFF) {
    return 'Fan';
  } else if (item > 0 && item < ProfileRating.FAN) {
    return 'Novice';
  }
  return '';
};
export const filter = {
  [FilterType.ALL]: (films) => films.filter(({userDetails}) => userDetails),
  [FilterType.WATCH_LIST]: (films) => films.filter(({userDetails}) => !!userDetails.watchList),
  [FilterType.ALREADY_WATCHED]: (films) => films.filter(({userDetails}) => !!userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter(({userDetails}) =>!!userDetails.favorite),
};
