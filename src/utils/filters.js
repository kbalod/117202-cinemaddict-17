import {FilterType} from '../const';

const filter = {
  [FilterType.WATCH_LIST]: (films) => films.filter(({filmsInfo}) => !!filmsInfo.userDetails.watchList),
  [FilterType.ALREADY_WATCHED]: (films) => films.filter(({filmsInfo}) => !!filmsInfo.userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter(({filmsInfo}) =>!!filmsInfo.userDetails.favorite),
};

export {filter};
