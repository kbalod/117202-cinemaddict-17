import PopupFilmView from '../view/popup-view.js';
import CardFilmView from '../view/card-film.js';
import {render,remove, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const siteFooterElement = document.querySelector('.footer');

export default class FilmCardPresenter {
  #filmListContainerComponent = null;

  #filmCard = null;
  #filmPopup = null;
  #commentsModel = [];
  #film = null;
  #comments = null;
  #changeData = null;
  #filmsModel = null;
  #filterModel = null;
  #presenterChange = null;

  constructor(filmListContainerComponent, changeData,commentsModel,filmsModel,filterModel,presenterChange) {
    this.#filmListContainerComponent = filmListContainerComponent;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#presenterChange = presenterChange;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCard;
    const prevPopupComponent = this.#filmPopup;
    this.#filmCard = new CardFilmView(film,this.#commentsModel);
    this.#filmPopup = new PopupFilmView(film, this.#commentsModel,this.#handleViewAction,this.#presenterChange);

    this.#filmCard.setClickHandler(this.#onFilmCardClick);
    this.#filmCard.setClickButtonWatchListHandler(this.#handleWatchListClick);
    this.#filmCard.setClickButtonWatchedHandler(this.#handleAlreadyWatchedClick);
    this.#filmCard.setClickButtonFavoriteHandler(this.#handleFavoriteClick);

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
      this.#filmPopup.renderCommentInfo(this.#commentsModel.comments);

      this.#filmPopup.element.scrollTop = scrollPosition;
      this.#setPopupHandlers();
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCard);
  };

  #handleViewAction = async (actionType,updateType, update) => {
    switch(actionType){
      case UserAction.ADD_ELEMENT:
        try{
          await this.#commentsModel.addComment(updateType, update,this.#film.id);
        }catch (err){
          throw new Error('Can\'t add comment');
        }
        break;
      case UserAction.DELETE_ELEMENT:
        try{
          await this.#commentsModel.deleteComment(updateType, update);
        }catch (err){
          throw new Error('Can\'t delete comment');
        }
        break;
    }
  };

  #handleWatchListClick = () => {
    this.#changeData(UserAction.UPDATE_ELEMENT,
      this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      Object.assign(
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
      this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      Object.assign({},this.#film,
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
      this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      Object.assign(
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

  #changeCardClick = async () => {
  };

  #setPopupHandlers = () => {
    this.#filmPopup.setClickButtonCloseHandlerPopup(this.#removePopup);
    this.#filmPopup.setClickButtonWatchListHandlerPopup(this.#handleWatchListClick);
    this.#filmPopup.setClickButtonWatchedHandlerPopup(this.#handleAlreadyWatchedClick);
    this.#filmPopup.setClickButtonFavoriteHandlerPopup(this.#handleFavoriteClick);
    this.#filmPopup.setInnerHandlers();
    this.#filmPopup.setDeleteButtonClick(this.#changeCardClick);
  };

  #removePopup = () => {
    remove(this.#filmPopup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #renderPopup = () => {
    render(this.#filmPopup, siteFooterElement);
    this.#filmPopup.renderCommentInfo(this.#commentsModel.comments);

    document.body.classList.add('hide-overflow');

    this.#setPopupHandlers();

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #onFilmCardClick = async () => {
    if (document.querySelector('.film-details')) {
      if (!document.body.contains(this.#filmPopup.element)) {await this.#commentsModel.init(this.#film.id);}
      this.#removePopup();
    } else {
      await this.#commentsModel.init(this.#film.id);
    }

    this.#renderPopup(this.#film);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

}
