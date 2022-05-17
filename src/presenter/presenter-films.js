import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardFilmView from '../view/card-film.js';
import PopupFilmView from '../view/popup-view.js';
import {render} from '../render.js';
import { generateComments } from '../fish/data.js';

const siteFooterElement = document.querySelector('.footer');

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;

  #filmsContainer = new FilmContainerView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #loadMoreButtonComponent = new ShowMoreButtonView();
  #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  init = (filmContainer, filmsModel) => {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];

    render(this.#filmsContainer, this.#filmContainer);
    render(this.#filmListComponent, this.#filmsContainer.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);

    for (let i = 0; i < Math.min(this.#films.length,FILM_COUNT_PER_STEP); i++) {
      const card = new CardFilmView(this.#films[i]);
      render(card, this.#filmListContainerComponent.element);
      console.log(card.element);
      card.element.addEventListener('click', () => this.#onFilmCardClick(this.#films[i],generateComments(this.#films[i].comments)));
    }


    if (this.#films.length > FILM_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.#filmListComponent.element);

      this.#loadMoreButtonComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
    }

  };

  #onFilmCardClick = (films,comments) => {
    const filmComponent = new PopupFilmView(films,comments);
    document.querySelector('body').classList.add('hide-overflow');
    const removePopup = () => {
      siteFooterElement.removeChild(siteFooterElement.querySelector('.film-details'));
      document.querySelector('body').classList.remove('hide-overflow');
    };

    if (document.querySelector('.film-details')) {
      removePopup();

    }
    render(filmComponent,siteFooterElement);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    document.addEventListener('keydown', onEscKeyDown);
  };

  #handleLoadMoreButtonClick = (evt) => {
    //const cardMore = new CardFilmView();
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((films) => {
        const cardMore = new CardFilmView(films);
        render(new CardFilmView(films),this.#filmListContainerComponent.element);
        cardMore.element.addEventListener('click', () => this.#onFilmCardClick(this.#films,generateComments(this.#films.comments)));
      });

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }

  };


  //render(new ShowMoreButtonView(), this.#filmListComponent.element);
}


