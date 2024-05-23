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
import {ADMIN_AUTH_TOKEN, AUTH_TOKEN, EMAIL_ADDRESS} from '../../storage-service';
import {EmailConfirmationSentPage} from "../email-confirmation/email-confirmation-sent-page/index.js";
import {EmailConfirmationReceivedPage} from "../email-confirmation/email-confirmation-received-page/index.js";
import {AdminAuthorizationPage} from "../admin-authorization/admin-authorization-page";
import {AdminDashboardPage} from "../admin-dashboard/admin-dashboard-page";
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
          page.onNavigateToEmailConfirmationSent(()=> {
            router.redirect(ROUTE.EMAIL_CONFIRMATION_SENT)
          })
        })
        .addRoute(ROUTE.ADMIN_LOGIN, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(ADMIN_AUTH_TOKEN) != null) {
            router.redirect(ROUTE.ADMIN_DASHBOARD);
            return;
          }
          const page = new AdminAuthorizationPage(this.rootElement);
          page.onNavigateToDashboard(()=> {
            router.redirect(ROUTE.ADMIN_DASHBOARD)
          })
        })
        .addRoute(ROUTE.ADMIN_DASHBOARD, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(ADMIN_AUTH_TOKEN) == null) {
            router.redirect(ROUTE.ADMIN_LOGIN);
            return;
          }
          const page = new AdminDashboardPage(this.rootElement);
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
          page.onNavigateToEmailConfirmationSent(() => {
            router.redirect(ROUTE.EMAIL_CONFIRMATION_SENT);
          });
          page.onNavigateToLogin(()=>{
            router.redirect(ROUTE.LOGIN)
          })
        })
        .addRoute(ROUTE.EMAIL_CONFIRMATION_SENT, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(AUTH_TOKEN) != null) {
            router.redirect(ROUTE.FILE_LIST);
            return;
          }
          if (storage.get(EMAIL_ADDRESS) == null) {
            router.redirect(ROUTE.LOGIN)
            return;
          }
          const page = new EmailConfirmationSentPage(this.rootElement);
        })
        .addRoute(ROUTE.EMAIL_CONFIRMATION_RECEIVED, () => {
          this.rootElement.innerHTML = '';
          const storage = registry.getInstance('storageService');
          if (storage.get(AUTH_TOKEN) != null) {
            router.redirect(ROUTE.FILE_LIST);
            return;
          }
          const page = new EmailConfirmationReceivedPage(this.rootElement);
          page.onNavigateToLogin(()=>{
            router.redirect(ROUTE.LOGIN)
          })
          page.onNavigateToRegistration(()=>{
            router.redirect(ROUTE.REGISTRATION)
          })
        })
        .addRoute(ROUTE.FILE_LIST_FOLDER, (params) => {
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
          page.onSearch((folderId, searchValue) => {
            if (searchValue.length === 0) {
              router.redirect(ROUTE.FILE_LIST+'/'+folderId);
            } else {
              router.redirect(ROUTE.FILE_LIST+'/'+folderId+'?search='+searchValue);
            }
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
