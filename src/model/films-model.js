import {generateFilmsCard} from '../fish/data.js';
const MAX_FILMS = 20;
export default class FilmsModel {
  films = Array.from({length: MAX_FILMS}, generateFilmsCard);
  getFilms = () => this.films;

}

export {MAX_FILMS};
