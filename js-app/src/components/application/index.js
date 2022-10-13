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
      const page = new AuthorizationPage(this.rootElement);
      page.onNavigateToRegistration(()=>{
        window.location.hash = '#registration';
      });
    } else if (hash === '#registration') {
      const page = new RegistrationPage(this.rootElement);
      page.onNavigateToAuthorization(()=>{
        window.location.hash = '#login';
      });
    }
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `<slot></slot>`;
  }
}
