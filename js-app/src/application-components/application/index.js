import {Component} from '../../components/component';
import {AuthorizationPage} from '../authorization/authorization-page';
import {RegistrationPage} from '../registration/registration-page';
import {Router} from '../../router';
import {Error404Page} from '../../components/error-404-page';
import {RouterConfigBuilder} from '../../router/router-config';
import {TablePage} from '../table/table-page';
import {ApplicationContext} from '../application-context';
import {ROUTE} from '../../router/routes';
import {ChangeLocationMetadataAction} from '../../state-management/change-location-metadata-action';
import {registry} from '../../registry.js';
import {ResetStateAction} from '../../state-management/reset-state-action';
import {AUTH_TOKEN} from '../../storage-service';
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

    new ApplicationContext();

    const routerConfig = new RouterConfigBuilder()
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute(ROUTE.LOGIN, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(AUTH_TOKEN) != null) {
            registry.getInstance('stateManagementService').dispatch(new ResetStateAction());
            router.redirect(ROUTE.FILE_LIST);
            return;
          }
          const page =
            new AuthorizationPage(this.rootElement);
          page.onNavigateToRegistration(() => {
            router.redirect(ROUTE.REGISTRATION);
          });
          page.onNavigateToTable(()=>{
            router.redirect(ROUTE.FILE_LIST);
          });
        })
        .addRoute(ROUTE.REGISTRATION, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(AUTH_TOKEN) != null) {
            router.redirect(ROUTE.FILE_LIST);
            return;
          }
          const page =
            new RegistrationPage(this.rootElement);
          page.onNavigateToAuthorization(() => {
            router.redirect(ROUTE.LOGIN);
          });
        })
        .addRoute(ROUTE.FILE_LIST_FOLDER, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(AUTH_TOKEN) == null) {
            router.redirect(ROUTE.LOGIN);
            return;
          }
          const page = new TablePage(this.rootElement);
          page.onNavigateToFolder((folderId)=>{
            router.redirect(ROUTE.FILE_LIST+'/'+folderId);
          });
        })
        .addMetadataChangeListener((metadata)=>{
          registry.getInstance('stateManagementService').dispatch(new ChangeLocationMetadataAction(metadata));
        })
        .addHomeRoutePath(ROUTE.FILE_LIST_FOLDER)
        .build();
    registry.getInstance('apiService').redirectToLogin = ()=>{
      registry.getInstance('storageService').clear();
      router.redirect(ROUTE.LOGIN);
      setTimeout(()=>{
        registry.getInstance('stateManagementService').dispatch(new ResetStateAction());
      });
    };
    const router = new Router(routerConfig);
    router.handleUrlPath();
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `<slot></slot>`;
  }
}
