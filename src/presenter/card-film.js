import {UpdateType, TimeLimit} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import CardFilmView from '../view/card-film.js';

export default class FilmCardPresenter {
  #filmListContainerComponent = null;
  #openPopup = null;
  #filmsModel = null;
  #uiBlocker = null;

  #film = null;
  #filmCard = null;

  constructor(filmListContainerComponent, openPopup, filmsModel) {
    this.#filmListContainerComponent = filmListContainerComponent;
    this.#openPopup = openPopup;
    this.#filmsModel = filmsModel;
    this.#uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  }

  init = (film) => {
    this.#film = film;
    const prevFilmComponent = this.#filmCard;
    this.#filmCard = new CardFilmView(film);

    this.#filmCard.setOpenClickHandler(() => {
      this.#openPopup(film);
    });

    this.#filmCard.setWatchlistClickHandler(this.#handleWatchListClick);
    this.#filmCard.setWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCard.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmCard,this.#filmListContainerComponent);
      return;
    }

    if (this.#filmListContainerComponent.contains(prevFilmComponent.element)) {
      replace(this.#filmCard, prevFilmComponent);
    }
    remove(prevFilmComponent);

  };

  destroy = () => {
    remove(this.#filmCard);
  };

  setControlsAborting = () => {
    this.#filmCard.shakeControls(() => {
      this.#filmCard.updateElement({
        isDisabled: false,
      });
    });
  };

  setPopupControlsAborting = (detailsComponent) => {
    detailsComponent.shakeControls(detailsComponent.resetFormState);
  };

  setAddAborting = (detailsComponent) => {
    detailsComponent.shake(detailsComponent.resetFormState);
  };

  setDeleteAborting = (detailsComponent, target) => {
    const parentBlock = target.closest('.film-details__comment');

    detailsComponent.shakeCommentDelete(detailsComponent.resetFormState, parentBlock);
  };

  #handleWatchListClick = async () => {
    this.#uiBlocker.block();
    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, userDetails:{...this.#film.userDetails,watchList: !this.#film.userDetails.watchList}},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleAlreadyWatchedClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, userDetails:{...this.#film.userDetails,alreadyWatched: !this.#film.userDetails.alreadyWatched}},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };

  #handleFavoriteClick = async () => {
    this.#uiBlocker.block();

    try {
      await this.#filmsModel.updateFilm(
        UpdateType.MINOR,
        {...this.#film, userDetails:{...this.#film.userDetails,favorite: !this.#film.userDetails.favorite}},
      );
    } catch(err) {
      this.setControlsAborting();
    }

    this.#uiBlocker.unblock();
  };
}

