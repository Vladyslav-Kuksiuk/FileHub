import {Component} from '../component.js';
import {RegistrationForm} from '../registrationform';

/**
 * Authorization page component.
 */
export class RegistrationPage extends Component {
  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    new RegistrationForm(formSlot);
  }

  /**
   * Returns button's HTML as string.
   *
   * @returns {string}
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
