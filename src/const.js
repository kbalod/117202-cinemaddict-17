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

const UserAction = {
  UPDATE_ELEMENT: 'UPDATE_ELEMENT',
  ADD_ELEMENT: 'ADD_ELEMENT',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {FilterType,SortType,UserAction,UpdateType};
