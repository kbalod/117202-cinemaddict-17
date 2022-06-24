import FilmListView from '../view/films-list-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import LoadingView from '../view/loading-view.js';
import EmptyFilmsView from '../view/empty-film-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import SortFilterView from '../view/sort-filter-view.js';
import RangUserView from '../view/rang-user-view.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { SortType, UpdateType, TimeLimit,FilterType} from '../const.js';
import {render, RenderPosition,remove} from '../framework/render.js';
import {sortByDate,sortByRating,filter} from '../utils/utils.js';


const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');


const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsModel = null;
  #filmsContainer = null;
  #emptyFilms= null;
  #filmDetailsComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #filterModel = null;
  #isLoading = true;
  #commentsModel = null;
  #uiBlocker = null;
  #rangUser = null;

  #filmCardPresenter = new Map();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.ALL;
  #filterType = FilterType.ALL;

  #loadingComponent = new LoadingView();
  #filmListContainerComponent = new FilmListView();

  constructor(filmsContainer, filterModel, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

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

  init = () => {
    this.#renderFilmsContainer();
  };

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ShowMoreButtonView();
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);

    render(this.#loadMoreButtonComponent, this.#filmListContainerComponent.element);
  };

  #renderNoFilms = () => {
    this.#emptyFilms = new EmptyFilmsView(this.#filterType);
    render(this.#emptyFilms,this.#filmListContainerComponent.mainListElement, RenderPosition.AFTERBEGIN);
  };

  #renderFilmCard (film) {
    const filmCardPresenter = new FilmCardPresenter(this.#filmListContainerComponent.mainListElement,this.#openPopup,this.#filmsModel);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film)=> this.#renderFilmCard(film));
  };

  #renderRungUser = () => {
    const films = this.#filmsModel.films;
    const watchedFilms = filter[FilterType.ALREADY_WATCHED](films).length;

    if (watchedFilms === 0) {
      return;
    }

    this.#rangUser = new RangUserView(watchedFilms);

    render(this.#rangUser, siteHeaderElement);
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
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
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
    render(this.#loadingComponent, this.#filmListContainerComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sortComponent = new SortFilterView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#filmListContainerComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#loadMoreButtonComponent);
    remove(this.#rangUser);
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
    const filmCount = this.films.length;
    render(this.#filmListContainerComponent, this.#filmsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (filmCount === 0){
      this.#renderNoFilms();
      return;
    }
    this.#renderSort();

    this.#renderFilms(this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP)));
    this.#renderRungUser();
    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  };

  #openPopup = async (film) => {
    this.film = film;

    if (this.#filmDetailsComponent) {
      this.#closePopup();
    }

    const comments = await this.#commentsModel.getComments(film.id);

    this.#filmDetailsComponent = new FilmDetailsView(this.film, comments);
    this.#filmDetailsComponent.setCloseClickHandler(this.#closePopup);
    this.#filmDetailsComponent.setWatchlistPopupClickHandler(this.#watchlistPopupClickHandler);
    this.#filmDetailsComponent.setWatchedPopupClickHandler(this.#watchedPopupClickHandler);
    this.#filmDetailsComponent.setFavoritePopupClickHandler(this.#favoritePopupClickHandler);
    this.#filmDetailsComponent.setAddSubmitHandler(this.#handleCommentAddHandler);
    this.#filmDetailsComponent.setDeleteClickHandler(this.#handleCommentDeleteHandler);

    render(this.#filmDetailsComponent, siteBodyElement);

    document.addEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.add('hide-overflow');
  };

  #closePopup = () => {
    remove(this.#filmDetailsComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.body.classList.remove('hide-overflow');
    this.#filmDetailsComponent = null;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #watchlistPopupClickHandler = async (film) => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, userDetails:{...film.userDetails,watchList: !film.userDetails.watchList}},
      );

      this.#filmDetailsComponent.updateElement({...film, userDetails:{...film.userDetails,watchList: !film.userDetails.watchList}});
    } catch(err) {
      this.#filmCardPresenter.get(film.id).setPopupControlsAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #watchedPopupClickHandler = async (film) => {
    this.#uiBlocker.block();
    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails,alreadyWatched : !film.userDetails.alreadyWatched}},
      );

      this.#filmDetailsComponent.updateElement({...film, userDetails:{...film.userDetails,alreadyWatched: !film.userDetails.alreadyWatched}});
    } catch(err) {
      this.#filmCardPresenter.get(film.id).setPopupControlsAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #favoritePopupClickHandler = async (film) => {
    this.#uiBlocker.block();
    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails,favorite: !film.userDetails.favorite}},
      );

      this.#filmDetailsComponent.updateElement({...film, userDetails:{...film.userDetails,favorite: !film.userDetails.favorite}});
    } catch(err) {
      this.#filmCardPresenter.get(film.id).setPopupControlsAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentAddHandler = async (film,comment) => {
    this.#uiBlocker.block();
    try {
      const newComments = await this.#commentsModel.addComment(UpdateType.PATCH, comment, film);
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film});
      this.#filmDetailsComponent.updateElementByComments(newComments, {comments: film.comments});
    } catch(err) {
      this.#filmCardPresenter.get(film.id).setAddAborting(this.#filmDetailsComponent);
    }

    this.#uiBlocker.unblock();
  };

  #handleCommentDeleteHandler = async (film, id, target, comments) => {
    this.#uiBlocker.block();

    target.disabled = true;
    target.textContent = 'Deleting...';
    const newComments = comments.filter((comment) => comment.id !== id);

    try {
      await this.#commentsModel.deleteComment(UpdateType.PATCH, id, film, comments);
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film});
      this.#filmDetailsComponent.updateElementByComments(newComments, {comments: film.comments});
    } catch(err) {
      target.textContent = 'Delete';
      target.disabled = false;
      this.#filmCardPresenter.get(film.id).setDeleteAborting(this.#filmDetailsComponent, target);
    }

    this.#uiBlocker.unblock();
  };
}
