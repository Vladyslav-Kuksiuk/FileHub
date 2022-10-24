import {Component} from '../component';
import {RegistrationForm} from '../registration-form';
import {TitleService} from '../../title-service';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';

/**
 * Registration page component.
 */
export class RegistrationPage extends Component {
  #eventTarget = new EventTarget();
  #apiService;

  /**
   * @param {HTMLElement} parent
   * @param {TitleService} titleService
   * @param {ApiService} apiService
   */
  constructor(parent, titleService, apiService) {
    super(parent);
    titleService.titles = ['Sign Up'];
    this.#apiService = apiService;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new RegistrationForm(formSlot);
    form.onNavigateToAuthorization(()=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
    });
    form.onSubmit((data)=>{
      this.#apiService.register(data)
        .then(()=>{
          this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
        })
        .catch((error)=>{
          error.errors ? form.formErrors = error.errors :form.headError = error.message;
        })
    });
  }

  /**
   * Adds listener on navigate to authorization event.
   *
   * @param {Function} listener
   */
  onNavigateToAuthorization(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
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
        <h1>Sign up to FileHub</h1>
        <hr class="horizontal-line">
        ${this.addSlot('form')}
    </main>
</div>
    `;
  }
}
