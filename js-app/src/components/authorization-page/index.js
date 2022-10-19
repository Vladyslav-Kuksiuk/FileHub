import {Component} from '../component.js';
import {AuthorizationForm} from '../authorization-form';

const NAVIGATE_EVENT_REGISTRATION = 'NAVIGATE_EVENT_REGISTRATION';
const NAVIGATE_EVENT_TABLE = 'NAVIGATE_EVENT_TABLE';
/**
 * Authorization page component.
 */
export class AuthorizationPage extends Component {
  #eventTarget = new EventTarget();
  #form;

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
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_REGISTRATION));
    });
    form.onSubmit((data)=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_TABLE));
    });
  }

  /**
   * Adds event listener on navigate to registration.
   * @param {function} listener
   */
  onNavigateToRegistration(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_REGISTRATION, listener);
  }

  /**
   * Adds event listener on navigate to table.
   *
   * @param {function} listener
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
