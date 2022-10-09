import {Component} from '../component.js';
import {Button} from '../button';
import {FormControl} from '../formcontrol';
import {EMAIL, PASSWORD} from '../../constants.js';
import {AuthorizationValidator} from '../../authorization/authorization-validator.js';

/**
 * Authorization page component.
 */
export class AuthorizationPage extends Component {
  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    const buttonSlot = this.getSlot('button');
    const button = new Button(buttonSlot);
    button.title = 'Sign In';

    const emailSlot = this.getSlot('email');
    const emailInput = new FormControl(emailSlot);
    emailInput.name = EMAIL;
    emailInput.labelText = 'Email';
    emailInput.placeholder = 'Email';

    const passwordSlot = this.getSlot('password');
    const passwordInput = new FormControl(passwordSlot);
    passwordInput.name = PASSWORD;
    passwordInput.labelText = 'Password';
    passwordInput.placeholder = 'Password';

    new AuthorizationValidator().addValidationToForm(button, [emailInput, passwordInput]);
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
        <form action="" class="form-horizontal form-page">
            ${this.addSlot('email')}
            ${this.addSlot('password')}
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    ${this.addSlot('button')}
                    <a class="form-link" href="" title="Sign Up">Don't have account?</a>
                </div>
            </div>
        </form>
    </main>
</div>
    `;
  }
}
