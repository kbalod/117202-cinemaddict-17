import {createElement} from '../render.js';

const createFilmListContainerTemplate = () => ('<section class="films"></section>');

export default class FilmListContainerView {
  #element = null;
  get template() {
    return createFilmListContainerTemplate();
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
