import {Component} from '../component';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router';
import {Error404Page} from '../error-404-page';
import {RouterConfigBuilder} from '../../router/router-config';
import {TablePage} from '../table-page';
import {ApplicationContext} from '../../application-context';
import {StateManagementService} from '../../state-management/state-management-service';
import {MUTATORS} from '../../state-management/mutators';
import {STATE} from '../../state-management/state';

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

    const applicationContext = new ApplicationContext();
    const state = {
      [STATE.IS_USER_PROFILE_LOADING]: true,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
      [STATE.IS_FOLDER_INFO_LOADING]: true,
      [STATE.FOLDER_INFO]: null,
      [STATE.FOLDER_INFO_ERROR]: null,
      [STATE.IS_FOLDER_CONTENT_LOADING]: true,
      [STATE.FOLDER_CONTENT]: null,
      [STATE.FOLDER_CONTENT_ERROR]: null,
    };
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    const routerConfig = new RouterConfigBuilder()
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement, applicationContext.titleService);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute(LOGIN_PATH, () => {
          this.rootElement.innerHTML = '';
          const page =
            new AuthorizationPage(this.rootElement, applicationContext.titleService, applicationContext.apiService);
          page.onNavigateToRegistration(() => {
            router.redirect(REGISTRATION_PATH);
          });
          page.onNavigateToTable(()=>{
            router.redirect(TABLE_PATH);
          });
        })
        .addRoute(REGISTRATION_PATH, () => {
          this.rootElement.innerHTML = '';
          const page =
            new RegistrationPage(this.rootElement, applicationContext.titleService, applicationContext.apiService);
          page.onNavigateToAuthorization(() => {
            router.redirect(LOGIN_PATH);
          });
        })
        .addRoute(TABLE_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new TablePage(this.rootElement, stateManagementService, applicationContext.titleService);
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
