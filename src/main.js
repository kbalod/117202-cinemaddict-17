import MainFilterView from './view/filters-menu-main.js';
import SortFilterView from './view/filters-menu-sort.js';
import RankUserView from './view/rank-user.js';
import FilmsPresenter from './presenter/presenter-films.js';
import PopupFilmView from './view/popup.js';
import {render} from './render.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const filmsPresenter = new FilmsPresenter();

render(new MainFilterView(), siteMainElement);
render(new SortFilterView(), siteMainElement);
render(new RankUserView(), siteHeaderElement);

filmsPresenter.init(siteMainElement);
render(new PopupFilmView(), siteFooterElement);
