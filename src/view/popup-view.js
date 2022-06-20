import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDueDatePopup } from '../utils/utils.js';
import AddCommentView from './add-comments.js';
import CommentView from './comment.js';
import {render} from '../render.js';

const createPopupFilmTemplate = (films, commentsCuryFilm) => {
  const {filmsInfo,userDetails} = films;

  const release = humanizeDueDatePopup(filmsInfo.release.date);
  const genresNaming = filmsInfo.genre.length > 1 ? 'Genres' : 'Genre';
  const activeIconButton = 'film-details__control-button--active';

  const checkWatchList = userDetails.watchList === true
    ? activeIconButton
    : '';

  const checkAlreadyWatched = userDetails.alreadyWatched === true
    ? activeIconButton
    : '';

  const checkFavorite = userDetails.favorite === true
    ? activeIconButton
    : '';

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmsInfo.poster}" alt="">

          <p class="film-details__age">${filmsInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmsInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmsInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmsInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tbody><tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmsInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmsInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmsInfo.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${release}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmsInfo.runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmsInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresNaming}</td>
              <td class="film-details__cell">
            ${filmsInfo.genre}
              </td>
            </tr>
          </tbody></table>

          <p class="film-details__film-description">
            ${filmsInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${checkWatchList}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${checkAlreadyWatched}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${checkFavorite}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCuryFilm.length}</span></h3>
        <ul class="film-details__comments-list"></ul>
      </section>
    </div>
  </form>
</section>`
  );};

export default class PopupFilmView extends AbstractView {
  #films = null;
  #commentsCuryFilm = null;
  #addCommentComponent = null;
  #container = null;

  constructor(films,commentsCuryFilm) {
    super();
    this._state = PopupFilmView.filmsToState(films);
    this.#commentsCuryFilm = commentsCuryFilm;
    this.#addCommentComponent = new AddCommentView();
  }

  get template() {
    return createPopupFilmTemplate(this._state,this.#commentsCuryFilm);
  }

  get container () {
    this.#container = this.element.querySelector('.film-details__comments-list');

    return this.#container;
  }

  static filmsToState = (films) => ({...films, 'emotionComment': null});

  _restoreHandlers = () => {
    this.setInnerHandlers();
    this.setClickButtonCloseHandlerPopup(this._callback.click);
    this.setClickButtonWatchListHandlerPopup(this._callback.clickButtonPopupWatchList);
    this.setClickButtonWatchedHandlerPopup(this._callback.clickButtonPopupWatched);
    this.setClickButtonFavoriteHandlerPopup(this._callback.clickButtonPopupFavorite);
  };

  renderCommentInfo = (comments) => {
    this.#renderComments(comments);
    this.#renderAddComment();
  };

  #renderComments = (comments = []) => {
    for (const comment of comments) {
      const commentComponent = new CommentView(comment);
      //commentComponent.setFormKeydownHandler(this.#changeData);
      render(commentComponent,this.container);
    }
  };

  #renderAddComment = () => {
    render(this.#addCommentComponent, this.container);
  };

  setClickButtonCloseHandlerPopup = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setClickButtonWatchListHandlerPopup = (callback) => {
    this._callback.clickButtonPopupWatchList = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#clickHandlerButtonWatchList);
  };

  setClickButtonWatchedHandlerPopup = (callback) => {
    this._callback.clickButtonPopupWatched = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#clickHandlerButtonWatched);
  };

  setClickButtonFavoriteHandlerPopup = (callback) => {
    this._callback.clickButtonPopupFavorite = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#clickHandlerButtonFavorite);
  };

  setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#switchButton);
  };

  setClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandlerFilm);
  };

  #switchButton = () => {
    this._restoreHandlers();
  };

  #changeData = () =>{
    this._callback.changeData();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #clickHandlerFilm = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

  #clickHandlerButtonWatchList = (evt) => {
    evt.preventDefault();
    this._callback.clickButtonPopupWatchList();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  #clickHandlerButtonWatched = (evt) => {
    evt.preventDefault();
    this._callback.clickButtonPopupWatched();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  #clickHandlerButtonFavorite = (evt) => {
    evt.preventDefault();
    this._callback.clickButtonPopupFavorite();
    evt.target.classList.toggle('film-details__control-button--active');
  };
}
