import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardFilmView from '../view/card-film.js';
import PopupFilmView from '../view/popup-view.js';
import {render} from '../render.js';
import { generateComments } from '../fish/data.js';

const siteFooterElement = document.querySelector('.footer');

const MAX_COUNT_STEP_FILMS = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;

  #filmsContainer = new FilmContainerView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();

  #films = [];

  init = (filmContainer, filmsModel) => {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];

    render(this.#filmsContainer, this.#filmContainer);
    render(this.#filmListComponent, this.#filmsContainer.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    for (let i = 0; i < MAX_COUNT_STEP_FILMS; i++) {
      const card = new CardFilmView(this.#films[i]);
      render(card, this.#filmListContainerComponent.element);
      card.element.addEventListener('click', () => alert(this.#films[i].id));
    }

    render(new ShowMoreButtonView(), this.#filmListComponent.element);
    //render(new PopupFilmView(this.#films[0],generateComments(this.#films[0].comments)), siteFooterElement);
  };
}


