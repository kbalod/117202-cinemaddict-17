import AbstractView from '../framework/view/abstract-view.js';

const createMainFilterTemplate = (filters) => {
  const watchList = filters.find((filter) => filter.name === 'watchList').count;
  const history = filters.find((filter) => filter.name === 'alreadyWatched').count;
  const favorites = filters.find((filter) => filter.name === 'favorite').count;

  return (`<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
  <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
</nav>`
  );};

export default class MainFilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainFilterTemplate(this.#filters);
  }
}
