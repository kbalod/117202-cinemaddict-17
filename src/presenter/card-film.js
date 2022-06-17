import PopupFilmView from '../view/popup-view.js';
import CardFilmView from '../view/card-film.js';
import { generateComments } from '../fish/data.js';
import {render,remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import {nanoid} from 'nanoid';

const siteFooterElement = document.querySelector('.footer');

export default class FilmCardPresenter {
  #filmListContainerComponent = null;

  #filmCard = null;
  #filmPopup = null;

  #film = null;
  #comments = null;
  #changeData = null;

  constructor(filmListContainerComponent, changeData) {
    this.#filmListContainerComponent = filmListContainerComponent;
    this.#changeData = changeData;

  }

  init = (film) => {
    this.#film = film;
    this.#comments = generateComments(film.comments);

    const prevFilmComponent = this.#filmCard;
    const prevPopupComponent = this.#filmPopup;
    this.#filmCard = new CardFilmView(film);
    this.#filmPopup = new PopupFilmView(film, this.#comments);

    this.#filmCard.setClickHandler(this.#onFilmCardClick);
    this.#filmCard.setClickButtonWatchListHandler(this.#handleWatchListClick);
    this.#filmCard.setClickButtonWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#filmCard.setClickButtonFavoriteHandler(this.#handleFavoriteClick);
    this.#filmPopup.
    if (prevFilmComponent === null && prevPopupComponent === null) {
      render(this.#filmCard,this.#filmListContainerComponent);
      return;
    }

    if (this.#filmListContainerComponent.contains(prevFilmComponent.element)) {
      replace(this.#filmCard, prevFilmComponent);
    }

    if (document.body.contains(prevPopupComponent.element)) {
      const scrollPosition = prevPopupComponent.element.scrollTop;

      replace(this.#filmPopup, prevPopupComponent);
      this.#filmPopup.renderCommentInfo(this.#comments);

      this.#filmPopup.element.scrollTop = scrollPosition;
      this.#setPopupHandlers();
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCard);
  };

  #handleFormSubmit = (film) => {
    this.#changeData(
      UserAction.ADD_ELEMENT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      {id: nanoid(), ...film},
    );

    this.destroy();
  };

  #handleWatchListClick = () => {
    this.#changeData(UserAction.UPDATE_ELEMENT,
      UpdateType.PATCH,Object.assign(
        {},
        this.#film,
        {
          userDetails:
        {
          watchList: !this.#film.userDetails.watchList,
          alreadyWatched: this.#film.userDetails.alreadyWatched,
          favorite: this.#film.userDetails.favorite,
          watchingDate: this.#film.userDetails.watchingDate
        },
        },
      ));
  };

  #handleFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_ELEMENT,
      UpdateType.PATCH,Object.assign(
        {},
        this.#film,
        {
          userDetails:
        {
          watchList: this.#film.userDetails.watchList,
          alreadyWatched: this.#film.userDetails.alreadyWatched,
          favorite: !this.#film.userDetails.favorite,
          watchingDate: this.#film.userDetails.watchingDate
        },
        },
      ));
  };


  #handleAlreadyWatchedClick = () => {
    this.#changeData(UserAction.UPDATE_ELEMENT,
      UpdateType.PATCH,Object.assign(
        {},
        this.#film,
        {
          userDetails:
        {
          watchList: this.#film.userDetails.watchList,
          alreadyWatched: !this.#film.userDetails.alreadyWatched,
          favorite: this.#film.userDetails.favorite,
          watchingDate: this.#film.userDetails.watchingDate
        },
        },
      ));
  };

  #setPopupHandlers = () => {
    this.#filmPopup.setClickButtonCloseHandlerPopup(this.#removePopup);
    this.#filmPopup.setClickButtonWatchListHandlerPopup(this.#handleWatchListClick);
    this.#filmPopup.setClickButtonWatchedHandlerPopup(this.#handleAlreadyWatchedClick);
    this.#filmPopup.setClickButtonFavoriteHandlerPopup(this.#handleFavoriteClick);
    this.#filmPopup.setInnerHandlers();
  };

  #removePopup = () => {
    remove(this.#filmPopup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #renderPopup = () => {
    render(this.#filmPopup, siteFooterElement);
    this.#filmPopup.renderCommentInfo(this.#comments);

    document.body.classList.add('hide-overflow');

    this.#setPopupHandlers();

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #onFilmCardClick = () => {
    if (!document.body.contains(this.#filmPopup.element)) {
      this.#removePopup();
      this.#renderPopup();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

}
