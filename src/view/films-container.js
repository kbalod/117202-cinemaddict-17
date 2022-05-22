import AbstractView from '../framework/view/abstract-view.js';

const createFilmContainerTemplate = () => ('<section class="films"></section>');

export default class FilmContainerView extends AbstractView {
  get template() {
    return createFilmContainerTemplate();
  }
}
