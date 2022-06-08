import PopupFilmView from '../view/popup-view.js';
import CardFilmView from '../view/card-film.js';
import { generateComments } from '../fish/data.js';
import {render,remove, replace} from '../framework/render.js';


const siteFooterElement = document.querySelector('.footer');

export default class FilmCardPresenter {
  #filmListContainerComponent = null;
  #filmCard = null;
  #film = null;
  #changeData = null;
  constructor(filmListContainerComponent, changeData) {
    this.#filmListContainerComponent = filmListContainerComponent;
    this.#changeData = changeData;

  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmCard;
    this.#filmCard = new CardFilmView(film);

    this.#filmCard.setClickButtonWatchListHandler(this.#handleWatchListClick);
    this.#filmCard.setClickButtonWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#filmCard.setClickButtonFavoriteHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmCard,this.#filmListContainerComponent);
      this.#filmCard.setClickHandler(() => this.#onFilmCardClick(film, generateComments(film.comments)));
      return;
    }
    replace(this.#filmCard, prevFilmComponent);
    this.#filmCard.setClickHandler(() => this.#onFilmCardClick(film, generateComments(film.comments)));

  };

  destroy = () => {
    remove(this.#filmCard);
  };

  #handleWatchListClick = () => {
    this.#changeData(Object.assign(
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
    this.#changeData(Object.assign(
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

  #switchButton = () => {
    console.log(1);
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(Object.assign(
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

    filmComponent.setClickHandler(() => {
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    document.addEventListener('keydown', onEscKeyDown);

    filmComponent.setClickButtonWatchListHandlerPopup(this.#handleWatchListClick);
    filmComponent.setClickButtonWatchedHandlerPopup(this.#handleAlreadyWatchedClick);
    filmComponent.setClickButtonFavoriteHandlerPopup(this.#handleFavoriteClick);
    filmComponent.setInnerHandlers(this.#switchButton);
  };

}
