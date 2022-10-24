import {Component} from '../component';
import {AuthorizationForm} from '../authorization-form';
import {TitleService} from '../../title-service';
import {ApiService} from '../../server-connection/api-service';

const NAVIGATE_EVENT_REGISTRATION = 'NAVIGATE_EVENT_REGISTRATION';
const NAVIGATE_EVENT_TABLE = 'NAVIGATE_EVENT_TABLE';

/**
 * Authorization page component.
 */
export class AuthorizationPage extends Component {
  #eventTarget = new EventTarget();
  #apiService;

  /**
   * @param {HTMLElement} parent
   * @param {TitleService} titleService
   * @param {ApiService} apiService
   */
  constructor(parent, titleService, apiService) {
    super(parent);
    titleService.titles = ['Sign In'];
    this.#apiService = apiService;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new AuthorizationForm(formSlot);
    form.onNavigateToRegistration(() => {
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_REGISTRATION));
    });
    form.onSubmit((data) => {
      this.#error = null;
      this.#apiService.login(data)
          .then(() => {
            this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_TABLE));
          })
          .catch((error) => {
            form.headError = error.message;
          });
    });
  }

  /**
   * Adds listener on navigate to registration event.
   *
   * @param {Function} listener
   */
  onNavigateToRegistration(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_REGISTRATION, listener);
  }

  /**
   * Adds listener on navigate to table event.
   *
   * @param {Function} listener
   */
  onNavigateToTable(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_TABLE, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="TeamDev"><img alt="TeamDev" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Sign in to FileHub</h1>
        <hr class="horizontal-line">
        ${this.addSlot('form')}
    </main>
</div>
    `;
  }
}
