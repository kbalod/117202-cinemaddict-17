import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './render.js';
import FilmsApiService from './film-api-service.js';
import CommentsApiService from './comments-api-service.js';

import FooterView from './view/footer-view.js';

const AUTHORIZATION = 'Basic hS6664wcl7772jx';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement,filterModel,filmsModel,commentsModel);

filterPresenter.init();
filmsPresenter.init();
filmsModel.init()
  .finally(() => {
    render(new FooterView(filmsModel.films),siteFooterElement);
  });

