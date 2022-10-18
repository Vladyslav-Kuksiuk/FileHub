import {Component} from '../component.js';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router.js';
import {Error404Page} from '../error-404-page';
import {TitleService} from '../../title-service.js';

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

    const titleService = new TitleService('FileHub', ' - ');

    const router = Router.getBuilder()
        .addHomeRouteName('login')
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement, titleService);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute('login', () => {
          this.rootElement.innerHTML = '';
          const page = new AuthorizationPage(this.rootElement, titleService);
          page.onNavigateToRegistration(() => {
            router.redirect('registration');
          });
          page.onFormSubmit(()=>{
            router.redirect('table');
          });
        })
        .addRoute('registration', () => {
          this.rootElement.innerHTML = '';
          const page = new RegistrationPage(this.rootElement, titleService);
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
