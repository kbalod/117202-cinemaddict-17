import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const Error = {
  DELETING: false,
  ADDING: false,
  CHANGING: false
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  getComments = (id) => this._load({url: `comments/${id}`}).then(ApiService.parseResponse);

  deleteComment = async (comment) => await this._load({
    url: `comments/${comment}`,
    method: Method.DELETE,
    headers: new Headers({'Content-Type': 'application/json'}),
  });

  addComment = async (id,comment) => {
    const response = await this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info':{
        'title': film.filmsInfo.title,
        'alternative_title': film.filmsInfo.alternativeTitle,
        'total_rating': film.filmsInfo.totalRating,
        'poster': film.filmsInfo.poster,
        'age_rating': film.filmsInfo.ageRating,
        'director': film.filmsInfo.director,
        'writers': film.filmsInfo.writers,
        'actors': film.filmsInfo.actors,
        'release': {
          'date': film.filmsInfo.release.date,
          'release_country': film.filmsInfo.release.releaseCountry,
        },
        'runtime': film.filmsInfo.runtime,
        'genre': film.filmsInfo.genre,
        'description': film.filmsInfo.description,
      },
      'user_details':{
        watchlist: film.userDetails.watchList,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        favorite: film.userDetails.favorite,
      }
    };

    delete adaptedFilm.filmsInfo;
    delete adaptedFilm.userDetails;


    return adaptedFilm;
  };
}

export {Error};
