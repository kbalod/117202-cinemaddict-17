import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const commentTemplate = (data) => {
  const {
    author,
    comment,
    date,
    emotion,
  } = data;

  return `<li class="film-details__comment">
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
};

export default class CommentView extends AbstractStatefulView {
  #data = null;

  constructor () {
    super();

    this.#data = CommentView.parseFilmToData();
    //this.#setInnerHandlers();
  }

  get template () {
    return commentTemplate(this.#data);
  }

  static parseFilmToData = () => {
    const data = {};

    return {...data,
      author: '',
      comment: '',
      date: '',
      emotion: '',
    };
  };

  static parseDataToFilm = (data) => {
    const comment = {...data};

    return comment;
  };
}
