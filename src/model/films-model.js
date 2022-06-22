import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

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

  get filmsIdComment(){
    const comments = this.#films.comments;
    return comments;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedMovie,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      Error.CHANGING = true;
      update = this.films.find((item) => item.id === update.id);
      this._notify(UpdateType.PATCH, update);
      throw new Error('Can\'t update movie');
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
