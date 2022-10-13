import {Component} from '../component.js';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router.js';

/**
 * Authorization page component.
 */
export class Application extends Component {
  #page;
  #router;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.#router = new Router();
    this.#configureRouter(this.#router);
    this.init();
  }

  /**
   * @private
   * @param {Router} router
   */
  #configureRouter(router) {
    router.defaultPage = (slot) => {
      const form = new AuthorizationPage(slot);
      form.onNavigateToRegistration(() => {
        window.location.hash = '#registration';
      });
    };
    router.addPage('#login', (slot) => {
      const form = new AuthorizationPage(slot);
      form.onNavigateToRegistration(() => {
        window.location.hash = '#registration';
      });
    });
    router.addPage('#registration', (slot) => {
      const form = new RegistrationPage(slot);
      form.onNavigateToAuthorization(() => {
        window.location.hash = '#login';
      });
    });
  }

  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    this.#renderPage();
    window.addEventListener('hashchange', () => {
      this.#renderPage();
    });
  }

  /**
   * @private
   */
  #renderPage() {
    const hash = window.location.hash;
    this.rootElement.innerHTML = '';
    this.#router.getPage(hash)(this.rootElement);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `<slot></slot>`;
  }
}
