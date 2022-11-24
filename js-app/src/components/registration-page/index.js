import {Component} from '../component';
import {RegistrationForm} from '../registration-form';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';

/**
 * Registration page component.
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
   * @inheritDoc.
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new RegistrationForm(formSlot);
    form.onNavigateToAuthorization(()=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
    });
  }

  /**
   * Adds event listener on navigate to authorization.
   * @param {function} listener
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
