import {Component} from '../component.js';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router.js';
import {Error404Page} from '../error-404-page';

/**
 * Authorization page component.
 */
export class Application extends Component {
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
      const page = new AuthorizationPage(slot);
      page.onNavigateToRegistration(() => {
        window.location.hash = '#registration';
      });
    };
    router.error404Page = (slot) => {
      const page = new Error404Page(slot);
      page.onNavigateToHome(() => {
        window.location.hash = '';
      });
    };
    router.addPage('#login', (slot) => {
      const page = new AuthorizationPage(slot);
      page.onNavigateToRegistration(() => {
        window.location.hash = '#registration';
      });
    });
    router.addPage('#registration', (slot) => {
      const page = new RegistrationPage(slot);
      page.onNavigateToAuthorization(() => {
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
