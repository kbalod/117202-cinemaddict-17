import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import {render, RenderPosition,remove} from '../framework/render.js';
import EmptyFilmsView from '../view/empty.js';
import FilmCardPresenter from './card-film.js';
import {sortByDate,sortByRating} from '../utils/utils.js';
import MainFilterView from '../view/filters-menu-main.js';
import SortFilterView from '../view/filters-menu-sort.js';
import { SortType, UpdateType, UserAction} from '../const.js';


const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #filmsContainer = new FilmContainerView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #emptyFilms= new EmptyFilmsView();
  #films = [];
  #filmCardPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #sortMainComponent = new MainFilterView();
  #currentSortType = SortType.ALL;
  #sortComponent = null;
  #loadMoreButtonComponent = null;

  get films() {
    switch (this.#currentSortType) {
      case SortType.SORT_BY_DATE:
        return [...this.#filmsModel.films].sort(sortByDate);
      case SortType.SORT_BY_RATING:
        return [...this.#filmsModel.films].sort(sortByRating);
    }

    return this.#filmsModel.films;
  }

  init = (filmContainer,filmsModel) => {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    render(this.#filmListComponent, this.#filmsContainer.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    this.#renderFilmsContainer();

    this.#filmsModel.addObserver(this.#handleModelEvent);

  };

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ShowMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#loadMoreButtonComponent, this.#filmListComponent.element);
  };

  #renderNoFilms = () => {
    render(this.#emptyFilms,this.#filmListContainerComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleOpenPopup = () =>{
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  #renderFilmCard (film) {
    const filmCardPresenter = new FilmCardPresenter(this.#filmListContainerComponent.element,this.#handleViewAction,this.#handleModeChange);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film)=> this.#renderFilmCard(film));
  };

  #handleLoadMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmsCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmsCount;

    if (this.#renderedFilmCount >= filmsCount) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_ELEMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_ELEMENT:
        this.#filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_ELEMENT:
        this.#filmsModel.deleteFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#filmCardPresenter.get(data.id).init(data);
        this.#clearBoard();
        this.#renderFilmsContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderFilmCount: true, resetSortType: true});
        this.#renderFilmsContainer();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderFilmsContainer();
  };

  #renderSort = () => {
    this.#sortComponent = new SortFilterView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#filmListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#emptyFilms);
    remove(this.#loadMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };


  #renderFilmsContainer = () =>{
    const films = this.films;
    const filmCount = films.length;

    render(this.#filmsContainer, this.#filmContainer);

    if (filmCount === 0){
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();

    render(this.#filmListComponent, this.#filmsContainer.element);
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  };
}
