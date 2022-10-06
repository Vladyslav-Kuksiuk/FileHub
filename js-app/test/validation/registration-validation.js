import {FormValidationTester} from './form-validation-tester.js';
import {EMAIL_MIN_LENGTH, PASSWORD_MIN_LENGTH} from '../../constants.js';
import {RegistrationValidator} from '../../validation/registration-validator.js';

const emailLengthErrorMessage = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
const emailRegexpErrorMessage = 'Allowed only a-Z and +.-_@ .';
const passwordLengthErrorMessage = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;
const passwordMatchErrorMessage = 'Passwords don\'t match.';

/**
 * {@link FormValidationTester} implementation for registration.
 */
class AuthorizationValidationTester extends FormValidationTester {
  /**
   * Returns registration form as HTML in string.
   *
   * @returns {string}
   */
  getFormHTML() {
    return `
        <form action="" class="form-horizontal form-page">
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="email">Email</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="email" placeholder="Email" type="text" name="email">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="password">Password</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="password" placeholder="Password"
                           type="password" name="password">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label" for="confirm-password">Confirm Password</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" id="confirm-password" placeholder="Confirm Password"
                           type="password" name="confirm-password">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    <button class="btn btn-primary" title="Sign Up">Sign Up</button>
                    <a class="form-link" href="" title="Sign In">Already have an account?</a>
                </div>
            </div>
        </form>`;
  }

  /**
   * Fills email and password inputs in registration form.
   *
   * @param {HTMLFormElement} form
   * @param {[string]} values
   */
  fillInputs(form, values) {
    form.querySelector('input#email').value = values[0];
    form.querySelector('input#password').value = values[1];
    form.querySelector('input#confirm-password').value = values[2];
  }

  /**
   * Add registration validator to form.
   *
   * @param {HTMLFormElement} form
   */
  addValidator(form) {
    new RegistrationValidator().addValidationToForm(form);
  }
}

const tester = new AuthorizationValidationTester();

tester.addParametrizedErrorShowTest(
    'validateRegistration',
    [
      ['email', 'password', 'password',
        []],

      ['1', 'password', 'password',
        [emailLengthErrorMessage]],

      ['1%%%%%!', 'password', 'password',
        [emailRegexpErrorMessage]],

      ['email', 'pass', 'pass',
        [passwordLengthErrorMessage]],

      ['email', 'password', 'notPassword',
        [passwordMatchErrorMessage]],

      ['1', 'password', 'notPassword',
        [emailLengthErrorMessage, passwordMatchErrorMessage]],

      ['1%', 'password', 'password',
        [emailLengthErrorMessage, emailRegexpErrorMessage]],

      ['1%', 'pass', 'pass',
        [emailLengthErrorMessage, emailRegexpErrorMessage, passwordLengthErrorMessage]],

      ['1%', 'pass', 'notPassword',
        [emailLengthErrorMessage, emailRegexpErrorMessage, passwordLengthErrorMessage, passwordMatchErrorMessage]],
    ],
);

tester.addClearErrorTest(
    'clearValidateRegistration',
    [
      ['ema', 'pass', 'password'],
      ['email', 'password', 'password'],
    ],
);
