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
  filmsContainer = new FilmContainerView();
  filmListComponent = new FilmListView();
  filmListContainerComponent = new FilmListContainerView();

  init = (filmContainer, filmsModel) => {
    this.filmContainer = filmContainer;
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];

    render(this.filmsContainer, this.filmContainer);
    render(this.filmListComponent, this.filmsContainer.getElement());
    render(this.filmListContainerComponent, this.filmListComponent.getElement());
    for (let i = 0; i < MAX_COUNT_STEP_FILMS; i++) {
      render(new CardFilmView(this.films[i]), this.filmListContainerComponent.getElement());
    }

    render(new ShowMoreButtonView(), this.filmListComponent.getElement());

    render(new PopupFilmView(this.films[0],generateComments(this.films[0].comments)), siteFooterElement);
  };
}


