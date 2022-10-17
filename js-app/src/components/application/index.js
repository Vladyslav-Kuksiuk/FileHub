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
        .addRootElement(this.rootElement)
        .addHomePageName('login')
        .addErrorPage((slot) => {
          const page = new Error404Page(slot);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addPage('login', (slot) => {
          const page = new AuthorizationPage(slot);
          page.onNavigateToRegistration(() => {
            router.redirect('registration');
          });
        })
        .addPage('registration', (slot) => {
          const page = new RegistrationPage(slot);
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
