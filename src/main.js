import MainFilterView from './view/filters-menu-main.js';
import RankUserView from './view/rank-user.js';
import FilmsPresenter from './presenter/presenter-films.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './render.js';

import FooterView from './view/footer.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter();

render(new RankUserView(), siteHeaderElement);
render(new FooterView(),siteFooterElement);

filterPresenter.init();
filmsPresenter.init(siteMainElement,filmsModel,filterModel);

