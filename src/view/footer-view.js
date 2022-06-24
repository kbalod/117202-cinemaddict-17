import AbstractView from '../framework/view/abstract-view.js';


const createFooterTemplate = (count) => (
  `<section class="footer__statistics">
    <p>${count} movies inside</p>
  </section>
</footer>`
);

export default class FooterView extends AbstractView {

  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFooterTemplate(this.#films.length);
  }
}
