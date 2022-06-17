import FilmContainerView from '../view/films-container.js';
import FilmListView from '../view/films-list.js';
import FilmListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import LoadingView from '../view/loading.js';
import {render, RenderPosition,remove} from '../framework/render.js';
import EmptyFilmsView from '../view/empty.js';
import FilmCardPresenter from './card-film.js';
import {sortByDate,sortByRating} from '../utils/utils.js';
import SortFilterView from '../view/filters-menu-sort.js';
import { SortType, UpdateType, UserAction,FilterType} from '../const.js';
import {filter} from '../utils/filters.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #loadingComponent = new LoadingView();
  #filmsContainer = new FilmContainerView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();
  #emptyFilms= null;
  #films = [];
  #filmCardPresenter = new Map();
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.ALL;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #filterModel = null;
  #filterType = FilterType.ALL;
  #isLoading = true;

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.SORT_BY_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.SORT_BY_RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init = (filmContainer,filmsModel,filterModel) => {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#filterModel = filterModel;

    render(this.#filmListComponent, this.#filmsContainer.element);
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
    this.#renderFilmsContainer();

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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
    this.#emptyFilms = new EmptyFilmsView(this.#filterType);
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
        this.#clearBoard();
        this.#renderFilmsContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderFilmCount: true, resetSortType: true});
        this.#renderFilmsContainer();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmListComponent.element, RenderPosition.AFTERBEGIN);
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
    remove(this.#loadingComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.#emptyFilms) {
      remove(this.#emptyFilms);
    }

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
    render(this.#filmsContainer, this.#filmContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0){
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();

    render(this.#filmListComponent, this.#filmsContainer.element);
    this.#renderFilms(films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  };
}
