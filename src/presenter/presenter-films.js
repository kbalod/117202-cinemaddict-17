import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardFilmView from '../view/card-film.js';
import {render} from '../render.js';
import { generateComments } from '../fish/data.js';
const commentsArray = [];

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
    for (let i = 0; i < this.films.length; i++) {
      commentsArray.push(...generateComments(this.films[i].comments));
      render(new CardFilmView(this.films[i]), this.filmListContainerComponent.getElement());
    }
console.log(commentsArray);
    render(new ShowMoreButtonView(), this.filmListComponent.getElement());

  };
}

export {commentsArray};
