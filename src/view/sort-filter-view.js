import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortFilterTemplate = (currentSortType) => (
  `<ul class="sort">
  <li><a href="#" class ="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class ="sort__button ${currentSortType === SortType.SORT_BY_DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.SORT_BY_DATE}">Sort by date</a></li>
  <li><a href="#" class ="sort__button ${currentSortType === SortType.SORT_BY_RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.SORT_BY_RATING}">Sort by rating</a></li>
</ul>`
);

export default class SortFilterView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortFilterTemplate(this.#currentSortType);
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
