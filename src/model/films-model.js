import {generateComments, generateFilmsCard} from '../fish/data.js';

export default class FilmsModel {
  films = Array.from({length: 5}, generateFilmsCard);
  getFilms = () => this.films;

}
//comments = Array.from({length: 5}, generateComments);
//getComments = () => this.comments;

