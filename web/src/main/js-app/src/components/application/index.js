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
import {ROUTE} from '../../router/routes';

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
      [STATE.IS_USER_PROFILE_LOADING]: false,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
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
        .addRoute(ROUTE.LOGIN, () => {
          this.rootElement.innerHTML = '';
          const page =
            new AuthorizationPage(this.rootElement, applicationContext.titleService, applicationContext.apiService);
          page.onNavigateToRegistration(() => {
            router.redirect(ROUTE.REGISTRATION);
          });
          page.onNavigateToTable(()=>{
            router.redirect(ROUTE.TABLE);
          });
        })
        .addRoute(ROUTE.REGISTRATION, () => {
          this.rootElement.innerHTML = '';
          const page =
            new RegistrationPage(this.rootElement, applicationContext.titleService, applicationContext.apiService);
          page.onNavigateToAuthorization(() => {
            router.redirect(ROUTE.LOGIN);
          });
        })
        .addRoute(ROUTE.TABLE, () => {
          this.rootElement.innerHTML = '';
          const page = new TablePage(this.rootElement, stateManagementService, applicationContext.titleService);
          page.onNavigateToAuthorization(() => {
            router.redirect(ROUTE.LOGIN);
          });
        })
        .addHomeRoutePath(ROUTE.TABLE)
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