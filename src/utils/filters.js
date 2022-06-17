import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (films) => films.filter(({userDetails}) => userDetails),
  [FilterType.WATCH_LIST]: (films) => films.filter(({userDetails}) => !!userDetails.watchList),
  [FilterType.ALREADY_WATCHED]: (films) => films.filter(({userDetails}) => !!userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter(({userDetails}) =>!!userDetails.favorite),
};


export {filter};
