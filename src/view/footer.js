import { MAX_FILMS } from '../model/films-model.js';
import {createElement} from '../render.js';


const createFooterTemplate = () => (
  `

  <section class="footer__statistics">
    <p>${MAX_FILMS} movies inside</p>
  </section>
</footer>`
);

export default class FooterView {
  #element = null;
  get template() {
    return createFooterTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
