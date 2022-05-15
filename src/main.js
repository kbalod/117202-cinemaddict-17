import MainFilterView from './view/filters-menu-main.js';
import SortFilterView from './view/filters-menu-sort.js';
import RankUserView from './view/rank-user.js';
import FilmsPresenter from './presenter/presenter-films.js';
import FilmsModel from './model/films-model.js';
import {render} from './render.js';
import FooterView from './view/footer.js';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const filmsModel = new FilmsModel();


render(new MainFilterView(), siteMainElement);
render(new SortFilterView(), siteMainElement);
render(new RankUserView(), siteHeaderElement);
render(new FooterView(),siteFooterElement);
const filmsPresenter = new FilmsPresenter();
filmsPresenter.init(siteMainElement,filmsModel);

