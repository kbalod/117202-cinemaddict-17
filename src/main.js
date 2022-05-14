import MainFilterView from './view/filters-menu-main.js';
import SortFilterView from './view/filters-menu-sort.js';
import RankUserView from './view/rank-user.js';
import FilmsPresenter, { commentsArray } from './presenter/presenter-films.js';
import PopupFilmView from './view/popup-view.js';
import FilmsModel from './model/films-model.js';
import {render} from './render.js';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsPresenter();

render(new MainFilterView(), siteMainElement);
render(new SortFilterView(), siteMainElement);
render(new RankUserView(), siteHeaderElement);

filmsPresenter.init(siteMainElement,filmsModel);
const commentsArrayL = commentsArray;
const curyFilm = filmsModel.getFilms();

const commentsCuryFilm = commentsArrayL.slice(0,commentsArrayL.length-1).filter(({id})=> curyFilm[0].comments.some((commentsId)=> commentsId === Number(id)));
render(new PopupFilmView(curyFilm[0],commentsCuryFilm), siteFooterElement);

//коме
