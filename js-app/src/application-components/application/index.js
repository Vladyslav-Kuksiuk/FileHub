import {Component} from '../../components/component';
import {AuthorizationPage} from '../authorization/authorization-page';
import {RegistrationPage} from '../registration/registration-page';
import {Router} from '../../router';
import {Error404Page} from '../../components/error-404-page';
import {RouterConfigBuilder} from '../../router/router-config';
import {TablePage} from '../table/table-page';
import {ApplicationContext} from '../../application-context';
import {StateManagementService} from '../../state-management/state-management-service';
import {MUTATORS} from '../../state-management/mutators';
import {State} from '../../state-management/state';
import {ROUTE} from '../../router/routes';
import {ChangeLocationAction} from '../../state-management/change-location-action';
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
    console.log('123');

    const applicationContext = new ApplicationContext();
    const state = new State();
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
            router.redirect(ROUTE.FILE_LIST);
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
        .addRoute(ROUTE.FILE_LIST_FOLDER, (params) => {
          console.log('reroute');
          this.rootElement.innerHTML = '';
          stateManagementService.dispatch(new ChangeLocationAction(params.folderId));
          const page = new TablePage(this.rootElement, stateManagementService, applicationContext.titleService);
          page.onNavigateToAuthorization(() => {
            router.redirect(ROUTE.LOGIN);
          });
          page.onNavigateToFolder((folderId)=>{
            router.redirect(ROUTE.FILE_LIST+'/'+folderId);
          });
        })
        .addHomeRoutePath(ROUTE.FILE_LIST)
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
