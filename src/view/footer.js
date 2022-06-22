import AbstractView from '../framework/view/abstract-view.js';


const createFooterTemplate = () => (
  `

  <section class="footer__statistics">
    <p>30 movies inside</p>
  </section>
</footer>`
);

export default class FooterView extends AbstractView {
  get template() {
    return createFooterTemplate();
  }
}
