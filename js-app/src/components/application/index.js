import {Component} from '../component';
import {AuthorizationPage} from '../authorization-page';
import {RegistrationPage} from '../registration-page';
import {Router} from '../../router/router';
import {Error404Page} from '../error-404-page';
import {RouterConfigBuilder} from '../../router/router-config';
import {TablePage} from '../table-page';
import {ApplicationContext} from '../../application-context';

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

    const routerConfig = new RouterConfigBuilder()
        .addErrorRoute(() => {
          this.rootElement.innerHTML = '';
          const page = new Error404Page(this.rootElement, applicationContext);
          page.onNavigateToHome(() => {
            router.redirect('');
          });
        })
        .addRoute(LOGIN_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new AuthorizationPage(this.rootElement, applicationContext);
          page.onNavigateToRegistration(() => {
            router.redirect(REGISTRATION_PATH);
          });
          page.onNavigateToTable(()=>{
            router.redirect(TABLE_PATH);
          });
        })
        .addRoute(REGISTRATION_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new RegistrationPage(this.rootElement, applicationContext);
          page.onNavigateToAuthorization(() => {
            router.redirect(LOGIN_PATH);
          });
        })
        .addRoute(TABLE_PATH, () => {
          this.rootElement.innerHTML = '';
          const page = new TablePage(this.rootElement, applicationContext);
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
