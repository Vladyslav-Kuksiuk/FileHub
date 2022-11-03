import {Component} from '../component';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router';
import {Error404Page} from '../error-404-page';
import {TitleService} from '../../title-service';
import {RouterConfigBuilder} from '../../router/router-config';
import {ApiService} from '../../server-connection/api-service';
import {RequestService} from '../../server-connection/request-service';

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

    const titleService = new TitleService('FileHub', ' - ');
    const apiService = new ApiService(new RequestService());

    const routerConfig = new RouterConfigBuilder()
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement, titleService);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute(LOGIN_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new AuthorizationPage(this.rootElement, titleService, apiService);
          page.onNavigateToRegistration(() => {
            router.redirect(REGISTRATION_PATH);
          });
          page.onNavigateToTable(()=>{
            router.redirect('table');
          });
        })
        .addRoute(REGISTRATION_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new RegistrationPage(this.rootElement, titleService, apiService);
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
