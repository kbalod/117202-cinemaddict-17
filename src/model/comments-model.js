import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';
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
    } catch(err) {
      this.#comments = [];
    }
  };

  get comments() {
    return this.#comments;
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.deletedCommentId);
    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }
    try {
      await this.#filmApi.deleteComment(update.deletedCommentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      delete update.deletedCommentId;
    } catch(err) {
      Error.DELETING = true;
      update.comments.push(update.deletedCommentId);
      this._notify(UpdateType.PATCH, update);
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update) => {
    try {
      const updatedComments = await this.#filmApi.addComment(update);
      this.#comments = [...updatedComments.comments];
      delete update.newComment;
      update = updatedComments.film;
    } catch(err) {
      Error.ADDING = true;
      this._notify(UpdateType.PATCH, update);
      throw new Error('Can\'t create new comment');
    }
  };
}
