import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

const MAX_FILMS = 20;
export default class FilmsModel extends Observable{
  #filmsApiService = null;
  #films = [];
  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {

    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
      console.log(this.#films);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }
    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  addFilm = async (updateType, update) => {
    try {
      const response = await this.#filmsApiService.addFilm(update);
      const newFilm = this.#adaptToClient(response);
      this.#films = [newFilm,...this.#films,];

      this._notify(updateType, newFilm);
    } catch(err) {
      throw new Error('Can\'t add film');
    }
  };

  deleteFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }
    try {
      await this.#filmsApiService.deleteFilm(update);
      this.#films = [
        ...this.#films.slice(0, index),
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  };

  #adaptToClient = (film) => {
    const filmsInfo = {
      title: film.film_info.title,
      alternativeTitle: film.film_info.alternative_title,
      totalRating: film.film_info.total_rating,
      poster: film.film_info.poster,
      ageRating: film.film_info.age_rating,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      release: {
        date: film.film_info.release.date,
        releaseCountry: film.film_info.release.release_country,
      },
      runtime: film.film_info.runtime,
      genre: film.film_info.genre,
      description: film.film_info.description,
    };
    const userDetails = {
      watchList: film.user_details.watchlist,
      alreadyWatched: film.user_details.already_watched,
      watchingDate: film.user_details.watching_date,
      favorite: film.user_details.favorite,
    };

    const adaptedFilm = {...film,filmsInfo,userDetails};

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  };
}

export {MAX_FILMS};
