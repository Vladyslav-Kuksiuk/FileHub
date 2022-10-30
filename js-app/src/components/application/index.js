import {Component} from '../component';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router/router';
import {Error404Page} from '../error-404-page';
import {TitleService} from '../../title-service';
import {RouterConfigBuilder} from '../../router/router-config';
import {ApiService} from '../../server-connection/api-service';
import {RequestService} from '../../server-connection/request-service';
import {TablePage} from '../table-page';
import {StateManagementService} from '../../state-management/state-management-service';
import {USER_MUTATORS} from '../../state-management/user/user-mutator.js';

const LOGIN_PATH = 'login';
const REGISTRATION_PATH = 'registration';
const TABLE_PATH = 'table';

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
    const userState = {
      isAuthorized: false,
      isLoading: false,
      userId: null,
      username: null,
    }
    const userManagementService = new StateManagementService(USER_MUTATORS, userState)

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
            router.redirect(TABLE_PATH);
          });
        })
        .addRoute(REGISTRATION_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new RegistrationPage(this.rootElement, titleService, apiService);
          page.onNavigateToAuthorization(() => {
            router.redirect(LOGIN_PATH);
          });
        })
      .addRoute(TABLE_PATH, () => {
        this.rootElement.innerHTML = '';
        const page = new TablePage(this.rootElement, titleService, apiService, userManagementService);
        page.onNavigateToAuthorization(() => {
          router.redirect(LOGIN_PATH);
        });
      })
        .addHomeRoutePath(TABLE_PATH)
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
