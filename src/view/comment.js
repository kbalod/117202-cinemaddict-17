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

    this.#data = CommentView.parseCommentToData(comments);
  }

  get template () {
    return commentTemplate(this.#data);
  }

  setDeleteClickHandlers = (callback) => {
    this._callback.clickButtonDelete = callback;
    if(this.element.querySelector('.film-details__comment-delete')){
      this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#onButtonDelete);}
  };

  _restoreHandlers = () => {
    this.setDeleteClickHandlers(this.#onButtonDelete);
  };

  #onButtonDelete = (evt) => {
    evt.preventDefault();
    this._callback.clickButtonDelete(CommentView.parseDataToComments(this.#data).id);
  };

  get dataElement (){
    return this.#data;
  }

  static parseCommentToData = (comment) => ({...comment,
    isDisabled:false,
    isDeleting:false,
  });

  static parseDataToComments = (data) => {
    const comment = {...data};

    delete comment.isDisabled;
    delete comment.isDeleting;

    return comment;
  };
}
