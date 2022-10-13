import {Component} from '../component.js';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';

/**
 * Authorization page component.
 */
export class Application extends Component {
  #page;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    this.#renderPage();
    window.addEventListener('hashchange', ()=>{
      this.#renderPage();
    });
  }

  /**
   * @private
   */
  #renderPage() {
    const hash = window.location.hash;
    this.rootElement.innerHTML = '';
    if (hash === '#login') {
      new AuthorizationPage(this.rootElement);
    } else if (hash === '#registration') {
      new RegistrationPage(this.rootElement);
    }
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `<slot></slot>`;
  }
}
