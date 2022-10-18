import {Component} from '../component.js';
import {AuthorizationForm} from '../authorization-form';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';
const SUBMIT_EVENT = 'SUBMIT_EVENT';

/**
 * Authorization page component.
 */
export class AuthorizationPage extends Component {
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   * @param {TitleService} titleService
   */
  constructor(parent, titleService) {
    super(parent);
    titleService.titles = ['Sign In'];
    this.init();
  }

  /**
   * Adds authorization form to page.
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new AuthorizationForm(formSlot);

    form.onNavigateToRegistration(()=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
    });

    form.onSubmit(()=>{
      this.#eventTarget.dispatchEvent(new Event(SUBMIT_EVENT));
    });
  }

  /**
   * Adds event listener on navigate to registration.
   * @param {function} listener
   */
  onNavigateToRegistration(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
  }

  /**
   * Adds event listener on form submit.
   *
   * @param {function} listener
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
        <h1>Sign in to FileHub</h1>
        <hr class="horizontal-line">
        ${this.addSlot('form')}
    </main>
</div>
    `;
  }
}
