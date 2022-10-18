import {Component} from '../component.js';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router.js';
import {Error404Page} from '../error-404-page';

/**
 * Authorization page component.
 */
export class Application extends Component {
  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();

    const router = Router.getBuilder()
        .addHomeRouteName('login')
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute('login', () => {
          this.rootElement.innerHTML = '';
          const page = new AuthorizationPage(this.rootElement);
          page.onNavigateToRegistration(() => {
            router.redirect('registration');
          });
        })
        .addRoute('registration', () => {
          this.rootElement.innerHTML = '';
          const page = new RegistrationPage(this.rootElement);
          page.onNavigateToAuthorization(() => {
            router.redirect('login');
          });
        })
        .build();
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `<slot></slot>`;
  }
}
