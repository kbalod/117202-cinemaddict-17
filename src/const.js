export const MAX_DESCRIPTION_LENGTH = 140;
export const MIN_DESCRIPTION_LENGTH = 0;
export const DESCRIPTION_SLICE_LENGTH = 139;
export const SHAKE_CLASS_NAME = 'shake';
export const SHAKE_ANIMATION_TIMEOUT = 600;

export const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const FilterType = {
  ALL: 'all',
  WATCH_LIST: 'watch-list',
  ALREADY_WATCHED: 'already-watched',
  FAVORITE: 'favorite',
};

const SortType = {
  DEFAULT: 'default',
  SORT_BY_DATE: 'sort-by-date',
  SORT_BY_RATING: 'sort-by-rating',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export const ProfileRating = {
  MOVIE_BUFF: 21,
  FAN: 11,
};

export {FilterType,SortType,UpdateType};

