import {Component} from '../component.js';
import {RegistrationForm} from '../registration-form';
import {TitleService} from '../../title-service.js';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';
const SUBMIT_EVENT = 'SUBMIT_EVENT';

/**
 * Authorization page component.
 */
export class RegistrationPage extends Component {
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   * @param {TitleService} titleService
   */
  constructor(parent, titleService) {
    super(parent);
    titleService.titles = ['Sign Up'];
    this.init();
  }

  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new RegistrationForm(formSlot);
    form.onNavigateToAuthorization(()=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
    });
    form.onSubmit(()=>{
      this.#eventTarget.dispatchEvent(new Event(SUBMIT_EVENT));
    });
  }

  /**
   * Adds event listener on navigate to authorization.
   * @param {Function} listener
   */
  onNavigateToAuthorization(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
  }

  /**
   * Adds event listener on form submit.
   *
   * @param {Function} listener
   */
  onFormSubmit(listener) {
    this.#eventTarget.addEventListener(SUBMIT_EVENT, listener);
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
