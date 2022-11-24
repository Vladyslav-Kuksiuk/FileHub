import {Component} from '../component';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router/router.js';
import {Error404Page} from '../error-404-page';
import {RouterConfigBuilder} from '../../router/router-config.js';

const LOGIN_PATH = 'login';
const REGISTRATION_PATH = 'registration';

/**
 * Application component.
 */
export class Application extends Component {
  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();

    const routerConfig = new RouterConfigBuilder()
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute(LOGIN_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new AuthorizationPage(this.rootElement);
          page.onNavigateToRegistration(() => {
            router.redirect(REGISTRATION_PATH);
          });
        })
        .addRoute(REGISTRATION_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new RegistrationPage(this.rootElement);
          page.onNavigateToAuthorization(() => {
            router.redirect(LOGIN_PATH);
          });
        })
        .addHomeRoutePath(LOGIN_PATH)
        .build();

    const router = new Router(routerConfig);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `<slot></slot>`;
  }
}
