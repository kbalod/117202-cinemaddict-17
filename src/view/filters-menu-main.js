import AbstractView from '../framework/view/abstract-view.js';

const createMainFilterTemplateItem = (filters,currentFilterType) => {
  const {type, name, count,nameData} = filters;

  return `<a href="#${nameData}"
   class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-sort-type="${type}">
   ${name}
  ${nameData !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
  </a>
   `;
};

const createMainFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createMainFilterTemplateItem(filter, currentFilterType)).join('');

  return `<nav class="main-navigation">
  ${filterItemsTemplate}
  </nav>`;
};

export default class MainFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMainFilterTemplate(this.#filters,this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.sortType);
  };
}
