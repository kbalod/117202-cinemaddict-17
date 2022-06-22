import Observable from '../framework/observable.js';
import {Error} from '../film-api.js';

export default class CommentsModel extends Observable {
  #filmApi = null;
  #comments = [];

  constructor(filmApi) {
    super();
    this.#filmApi = filmApi;
  }

  init = async (id) => {
    try {
      this.#comments = await this.#filmApi.getComments(id);
      return this.#comments;
    } catch(err) {
      this.#comments = [];
    }
  };

  get comments() {
    return this.#comments;
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);
    if (index === -1) {
      throw new Error('Can\'t update unexciting comment');
    }
    try {
      await this.#filmApi.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
    } catch(err) {
      Error.DELETING = true;
      update.comments.push(update);
      this._notify(updateType, update);
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update,id) => {
    try {
      const updatedComments = await this.#filmApi.addComment(id,update);
      this.#comments = [...updatedComments.comments];
      delete update.newComment;
      update = updatedComments.film;
    } catch(err) {
      Error.ADDING = true;
      this._notify(updateType, update);
      throw new Error('Can\'t create new comment');
    }
  };
}
