import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';


const createMainFilterTemplate = (filters) =>
//console.log(filters);
// const watchList = filters.find((filter) => filter.name === 'watchList').count;
// const history = filters.find((filter) => filter.name === 'already-watched').count;
// const favorites = filters.find((filter) => filter.name === 'favorite').count;

  (
    `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item data-sort-type-${FilterType.ALL} main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item data-sort-type-${FilterType.WATCH_LIST}">Watchlist <span class="main-navigation__item-count">watchList</span></a>
  <a href="#history" class="main-navigation__item data-sort-type-${FilterType.ALREADY_WATCHED}">History <span class="main-navigation__item-count">history</span></a>
  <a href="#favorites" class="main-navigation__item data-sort-type-${FilterType.FAVORITE}">Favorites <span class="main-navigation__item-count">favorites</span></a>
</nav>`
  );

export default class MainFilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainFilterTemplate(this.#filters);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
