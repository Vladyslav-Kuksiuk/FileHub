import {Component} from '../../../components/component';
import {AdminAuthorizationForm} from '../admin-authorization-form';
import {inject} from '../../../registry';

const NAVIGATE_EVENT_DASHBOARD = 'NAVIGATE_EVENT_TABLE';

/**
 * Administrator authorization page component.
 */
export class AdminAuthorizationPage extends Component {
  #eventTarget = new EventTarget();
  @inject titleService;
  @inject apiService;
  @inject storageService;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.titleService.setTitles(['Admin Sign In']);
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new AdminAuthorizationForm(formSlot);
    form.onSubmit((data) => {
      this.apiService.logInAdmin(data)
          .then(() => {
            this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_DASHBOARD));
          })
          .catch((error) => {
              form.setHeadError(error.message);
          });
    });
  }

  /**
   * Adds listener on navigate to dashboard event.
   *
   * @param {Function} listener
   */
  onNavigateToDashboard(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_DASHBOARD, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Sign in to Administrator Dashboard</h1>
        <hr class="horizontal-line">
        ${this.addSlot('form')}
    </main>
</div>
    `;
  }
}
