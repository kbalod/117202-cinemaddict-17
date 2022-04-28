import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardFilmView from '../view/card-film.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmsContainer = new FilmContainerView();
  filmListComponent = new FilmListView();
  filmListContainerComponent = new FilmListContainerView();

  init = (filmContainer) => {
    this.filmContainer = filmContainer;

    render(this.filmsContainer, this.filmContainer);
    render(this.filmListComponent, this.filmsContainer.getElement());
    render(this.filmListContainerComponent, this.filmListComponent.getElement());

    for (let i = 0; i < 5; i++) {
      render(new CardFilmView(), this.filmListContainerComponent.getElement());
    }

    render(new ShowMoreButtonView(), this.filmListComponent.getElement());
  };
}
