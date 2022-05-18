import {generateFilmsCard} from '../fish/data.js';
const MAX_FILMS = 0;
export default class FilmsModel {
  #films = Array.from({length: MAX_FILMS}, generateFilmsCard);
  get films() {

    return this.#films;
  }
}

export {MAX_FILMS};
