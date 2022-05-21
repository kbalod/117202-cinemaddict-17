import { MAX_FILMS } from '../model/films-model.js';
import AbstractView from '../framework/view/abstract-view.js';


const createFooterTemplate = () => (
  `

  <section class="footer__statistics">
    <p>${MAX_FILMS} movies inside</p>
  </section>
</footer>`
);

export default class FooterView extends AbstractView {
  get template() {
    return createFooterTemplate();
  }
}
