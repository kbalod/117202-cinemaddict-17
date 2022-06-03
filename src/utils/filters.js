import {SortType} from '../const';

const filter = {
  [SortType.WATCH_LIST]: (films) => films.filter(({userDetails}) => !!userDetails.watchList),
  [SortType.ALREADY_WATCHED]: (films) => films.filter(({userDetails}) => !!userDetails.alreadyWatched),
  [SortType.FAVORITE]: (films) => films.filter(({userDetails}) =>!!userDetails.favorite),
};


export {filter};
