import {FormValidationTester} from './form-validation-tester.js';
import {AuthorizationValidator} from '../../validation/authorization-validator.js';
import {EMAIL_MIN_LENGTH, PASSWORD_MIN_LENGTH} from '../../constants.js';

const emailLengthErrorMessage = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
const passwordLengthErrorMessage = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;

/**
 * {@link FormValidationTester} implementation for authorization.
 */
class AuthorizationValidationTester extends FormValidationTester {
  /**
   * Returns authorization form as HTML in string.
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
                    <input class="form-control" id="email" placeholder="Email" type="text"
                    name="email">
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
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    <button class="btn btn-primary" title="Sign In">Sign In</button>
                    <a class="form-link" href="" title="Sign Up">Don't have account?</a>
                </div>
            </div>
        </form>`;
  }

  /**
   * Fills email and password inputs in authorization form.
   *
   * @param {HTMLFormElement}  form
   * @param {[string]} values
   */
  fillInputs(form, values) {
    form.querySelector('input#email').value = values[0];
    form.querySelector('input#password').value = values[1];
  }

  /**
   * Add authorization validator to form.
   *
   * @param {HTMLFormElement} form
   */
  addValidator(form) {
    new AuthorizationValidator().addValidationToForm(form);
  }
}

const tester = new AuthorizationValidationTester();

tester.addParametrizedErrorShowTest(
    'validateAuthorization',
    [
      ['email', 'password',
        []],

      ['1', 'password',
        [emailLengthErrorMessage]],

      ['1%', 'pass',
        [emailLengthErrorMessage, passwordLengthErrorMessage]],

      ['email', 'pass',
        [passwordLengthErrorMessage]],
    ],
);

tester.addClearErrorTest(
    'clearValidateAuthorization',
    [
      ['ema', 'pass'],
      ['email', 'password'],
    ],
);
