import AbstractView from '../framework/view/abstract-view.js';

const createFilmListContainerTemplate = () => ('<section class="films"></section>');

export default class FilmListContainerView extends AbstractView {
  get template() {
    return createFilmListContainerTemplate();
  }
}
