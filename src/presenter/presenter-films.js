import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import {render, RenderPosition,remove} from '../framework/render.js';
import EmptyFilmsView from '../view/empty.js';
import FilmCardPresenter from './card-film.js';
import {updateItem,sortByDate,sortByRating} from '../utils/utils.js';
import MainFilterView from '../view/filters-menu-main.js';
import SortFilterView from '../view/filters-menu-sort.js';
import { SortType } from '../const.js';


const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #filmsContainer = new FilmContainerView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #loadMoreButtonComponent = new ShowMoreButtonView();
  #emptyFilmsView = new EmptyFilmsView();
  #films = [];
  #filmCardPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #sortMainComponent = new MainFilterView();
  #sortComponent = new SortFilterView();
  #sourcedFilms = [];
  #currentSortType = SortType.ALL;

  init = (filmContainer,filmsModel) => {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];
    render(this.#filmsContainer, this.#filmContainer);
    render(this.#filmListComponent, this.#filmsContainer.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    this.#renderFilmsContainer();

  };

  #handleModeChange = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#filmListComponent.element);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #renderNoFilms = () => {
    render(this.#emptyFilmsView,this.#filmListContainerComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleOpenPopup = () =>{
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
      document.querySelector('body').classList.remove('hide-overflow');
    }
  };

  #renderFilmCard (film) {
    const filmCardPresenter = new FilmCardPresenter(this.#filmListContainerComponent.element,this.#handleFilmChange,this.#handleOpenPopup);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  }

  #renderFilms = (from, to) => {
    this.#films.slice(from, to).forEach((film) => this.#renderFilmCard(film));
  };

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #clearFilmList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderFilmsContainer = () =>{
    if (this.#films.length === 0){
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();
    this.#renderFilmList();

  };

  #handleFilmChange = (updatedTask) => {
    this.#films = updateItem(this.#films, updatedTask);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedTask);
    this.#filmCardPresenter.get(updatedTask.id).init(updatedTask);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.SORT_BY_DATE:
        this.#films.sort(sortByDate);
        break;
      case SortType.SORT_BY_RATING:
        this.#films.sort(sortByRating);
        break;
      default:
        this.#films = [...this.#sourcedFilms];
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmListComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

}


