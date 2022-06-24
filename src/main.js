import FilmsPresenter from './presenter/presenter-films.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './render.js';
import FilmsApiService from './film-api.js';
import CommentsApiService from './comments-api.js';

import FooterView from './view/footer.js';

const AUTHORIZATION = 'Basic hS6664wcl7772jx';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));

const filmsPresenter = new FilmsPresenter(siteMainElement,filterModel,filmsModel,commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);


filmsPresenter.init();
filterPresenter.init();
filmsModel.init()
  .finally(() => {
    render(new FooterView(filmsModel.films),siteFooterElement);
  });

