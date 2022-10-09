import {Component} from '../component.js';
import {Button} from '../button';
import {FormControl} from '../formcontrol';
import {CONFIRM_PASSWORD, EMAIL, PASSWORD} from '../../constants.js';
import {RegistrationValidator} from '../../registration/registration-validator.js';

/**
 * Authorization page component.
 */
export class RegistrationPage extends Component {
  /**
   * Adds form controls and button to form.
   */
  afterRender() {
    const buttonSlot = this.getSlot('button');
    const button = new Button(buttonSlot);
    button.title = 'Sign Up';

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

    const confirmSlot = this.getSlot('confirm-password');
    const confirmInput = new FormControl(confirmSlot);
    confirmInput.name = CONFIRM_PASSWORD;
    confirmInput.labelText = 'Confirm Password';
    confirmInput.placeholder = 'Confirm Password';

    new RegistrationValidator().addValidationToForm(button, [emailInput, passwordInput, confirmInput]);
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
            ${this.addSlot('confirm-password')}
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    ${this.addSlot('button')}
                     <a class="form-link" href="" title="Sign In">Already have an account?</a>
                </div>
            </div>
        </form>
    </main>
</div>
    `;
  }
}
