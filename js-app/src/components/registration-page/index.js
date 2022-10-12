import {Component} from '../component.js';
import {RegistrationForm} from '../registration-form';

/**
 * Authorization page component.
 */
export class RegistrationPage extends Component {
  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    new RegistrationForm(formSlot);
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
