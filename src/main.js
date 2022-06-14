import MainFilterView from './view/filters-menu-main.js';
import RankUserView from './view/rank-user.js';
import FilmsPresenter from './presenter/presenter-films.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

import {render} from './render.js';
import { generateFilter } from './fish/filter.js';

import FooterView from './view/footer.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();


render(new MainFilterView(filters,'all'), siteMainElement);
render(new RankUserView(), siteHeaderElement);
render(new FooterView(),siteFooterElement);

const filmsPresenter = new FilmsPresenter();
filmsPresenter.init(siteMainElement,filmsModel);


