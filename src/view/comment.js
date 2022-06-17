import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDueDateComment } from '../utils/utils.js';

const commentTemplate = (data) => {
  const {
    author,
    comment,
    date,
    emotion,
    isDisabled,
  } = data;

  if(!isDisabled){
    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeDueDateComment(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }else{
    return '<div>';
  }
};
export default class CommentView extends AbstractStatefulView {
  #data = null;

  constructor (comments) {
    super();

    this.#data = comments;
    this.#setDeleteClickHandlers();
  }

  get template () {
    return commentTemplate(this.#data);
  }

  _restoreHandlers = () => {
    this.#setDeleteClickHandlers();
  };

  #setDeleteClickHandlers = () => {
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#onButtonDelete);
  };

  #onButtonDelete = (evt) => {
    evt.preventDefault();
    this.#data = ({...this.#data,isDisabled: true,
      isSaving: false});
    this.updateElement(this.#data);
  };

  static parseFilmToData = () => ({...this.#data});

  static parseDataToFilm = (data) => {
    const comment = {...data};

    return comment;
  };
}
