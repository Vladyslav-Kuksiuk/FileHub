import {Component} from '../../../components/component';
import {AuthorizationForm} from '../authorization-form';
import {inject} from "../../../registry";

const NAVIGATE_EVENT_REGISTRATION = 'NAVIGATE_EVENT_REGISTRATION';
const NAVIGATE_EVENT_TABLE = 'NAVIGATE_EVENT_TABLE';

/**
 * Authorization page component.
 */
export class AuthorizationPage extends Component {
  #eventTarget = new EventTarget();
  @inject #titleService;
  @inject #apiService;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.#titleService.setTitles(['Sign In']);
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
      this.#apiService.logIn(data)
          .then(() => {
            this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_TABLE));
          })
          .catch((error) => {
            form.setHeadError(error.message);
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
