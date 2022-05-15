import {createElement} from '../render.js';
import { humanizeDueDatePopup } from '../utils.js';

const createPopupFilmTemplate = (films,commentsCuryFilm) => {
  const {filmsInfo} = films;
  const release = humanizeDueDatePopup(filmsInfo.release.date);
  const genresNaming = filmsInfo.genre.length > 1 ? 'Genres' : 'Genre';
  const activeIconButton = 'film-details__control-button--active';
  const checkWatchList = filmsInfo.userDetails.watchList === true
    ? activeIconButton
    : '';
  const checkAlreadyWatched = filmsInfo.userDetails.alreadyWatched === true
    ? activeIconButton
    : '';
  const checkFavorite = filmsInfo.userDetails.favorite === true
    ? activeIconButton
    : '';
  const addComments = () => {
    let commentsList = '';

    commentsCuryFilm.forEach((data) => {
      const { author, comment, date, emotion } = data;

      commentsList += `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
              </span>
              <div>
                <p class="film-details__comment-text">${comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${date}</span>
                  <button class="film-details__comment-delete">Delete</button>
                </p>
             </div>
           </li>`;
    });
    return commentsList;
  };

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${filmsInfo.poster}" alt="">

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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>
        <ul class="film-details__comments-list">
      ${addComments()}
        <div class="film-details__new-comment">

          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );};

export default class PopupFilmView {
  constructor(films,comments) {
    this.films = films;
    this.comments = comments;
  }

  getTemplate() {
    return createPopupFilmTemplate(this.films,this.comments);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
