import AbstractView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () => (`
<section class="films">
<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container" id="films-list-main"></div>
</section>`);

export default class FilmListView extends AbstractView {
  get template() {
    return createFilmListTemplate();
  }

  get mainListElement() {
    return this.element.querySelector('#films-list-main');
  }
}
