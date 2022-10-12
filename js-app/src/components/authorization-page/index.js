import {Component} from '../component.js';
import {AuthorizationForm} from '../authorization-form';

/**
 * Authorization page component.
 */
export class AuthorizationPage extends Component {
  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * Adds authorization form to page.
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    new AuthorizationForm(formSlot);
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
