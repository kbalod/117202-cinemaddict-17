import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDueDateFilmCard } from '../utils/utils.js';

const createCardFilmTemplate = (films) => {
  const {filmsInfo,comments} = films;
  const activeIcon = 'film-card__controls-item--active';
  const checkWatchList = filmsInfo.userDetails.watchList === true
    ? activeIcon
    : '';
  const checkAlreadyWatched = filmsInfo.userDetails.alreadyWatched === true
    ? activeIcon
    : '';
  const checkFavorite = filmsInfo.userDetails.favorite === true
    ? activeIcon
    : '';
  const release = humanizeDueDateFilmCard(filmsInfo.release.date);

  return (
    `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmsInfo.title}</h3>
    <p class="film-card__rating">${filmsInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${release}</span>
      <span class="film-card__duration">${filmsInfo.runtime}</span>
      <span class="film-card__genre">${filmsInfo.genre}</span>
    </p>
    <img src="./images/posters/${filmsInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmsInfo.description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${checkWatchList}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${checkAlreadyWatched}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${checkFavorite}" type="button">Mark as favorite</button>
  </div>
</article>`
  );};

export default class CardFilmView extends AbstractView {
  #films = null;
  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createCardFilmTemplate(this.#films);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  setClickButtonHandler = (callback) => {
    this._callback.clickButton = callback;
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#clickHandlerButton);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #clickHandlerButton = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this._callback.clickButton();
    evt.target.classList.toggle('film-card__controls-item--active');
  };
}
