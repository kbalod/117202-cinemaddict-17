import dayjs from 'dayjs';
import {MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH,FilterType,profileRating} from '../const';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const more = (a, b) => {
  if (a < b) {
    return 1;
  }
  return -1;
};

export const formatDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH)}...` : description;

const sortByRating = (taskA, taskB) => {
  const a = taskA.filmsInfo.totalRating;
  const b = taskB.filmsInfo.totalRating;
  return more(a,b);
};
const sortByDate = (taskA, taskB) => {
  const a = taskA.filmsInfo.release.date;
  const b = taskB.filmsInfo.release.date;
  return dayjs(b).diff(dayjs(a));
};

export const getProfileRating = (item) => {
  if (item >= profileRating.MOVIE_BUFF) {
    return 'Movie Buff';
  } else if (item >= profileRating.FAN && item < profileRating.MOVIE_BUFF) {
    return 'Fan';
  } else if (item > 0 && item < profileRating.FAN) {
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

export {getRandomInteger,sortByDate,sortByRating};
