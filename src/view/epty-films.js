import {createElement} from '../render.js';
const CUT_HREF = 23;
const variableText = {
  all: 'movies in our database',
  watchlist: 'movies to watch now',
  history: 'watched movies now',
  favorites: 'favorite movies now',
};

const createEmptyFilmsTemplate = () => {
  const siteMainElement = document.querySelector('.main');
  const siteMainElementContainer = siteMainElement.querySelector('.main-navigation');
  const siteMainElementContainerFragment = siteMainElementContainer.querySelectorAll('.main-navigation__item');
  let checkVariableText = '';
  siteMainElementContainerFragment.forEach((item)=> {
    if (item.classList.contains('main-navigation__item--active')){
      const result = item.href.substring(CUT_HREF);
      checkVariableText = variableText[result];
    }
  });
  return(`<h2 class="films-list__title">There are no ${checkVariableText}</h2>`);
};

export default class EmptyFilmsView {
  #element = null;
  get template() {
    return createEmptyFilmsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
