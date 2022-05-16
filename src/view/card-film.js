import {createElement} from '../render.js';
import { humanizeDueDateFilmCard } from '../utils.js';

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

export default class CardFilmView {
  #films = null;
  #element = null;
  constructor(films) {
    this.#films = films;
  }

  get template() {
    return createCardFilmTemplate(this.#films);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
