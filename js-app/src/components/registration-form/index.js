import {Component} from '../component.js';
import {FormControl} from '../formcontrol';
import {Form} from '../form';
import {FormValidationConfigBuilder} from '../../validation/form-validation-config.js';
import {validateByRegexp, validateLength, validateSameValue} from '../../validation/value-validations.js';
import {ValidationService} from '../../validation/validation-service.js';

const EMAIL = 'email';
const PASSWORD = 'password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;
const CONFIRM_PASSWORD = 'confirm-password';
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z\d+.\-_@]+$/;
/**
 * Authorization page component.
 */
export class RegistrationForm extends Component {
  /**
   * Adds form controls and button.
   */
  afterRender() {
    const form = new Form(this.parentElement);
    this._formControls = {};

    form.addInput((slot) => {
      const input = new FormControl(slot);
      input.name = EMAIL;
      input.labelText = 'Email';
      input.placeholder = 'Email';
      this._formControls[EMAIL] = input;
    });

    form.addInput((slot) => {
      const input = new FormControl(slot);
      input.name = PASSWORD;
      input.labelText = 'Password';
      input.placeholder = 'Password';
      input.inputType = 'password';
      this._formControls[PASSWORD] = input;
    });

    form.addInput((slot) => {
      const input = new FormControl(slot);
      input.name = CONFIRM_PASSWORD;
      input.labelText = 'Confirm Password';
      input.placeholder = 'Confirm Password';
      input.inputType = 'password';
      this._formControls[CONFIRM_PASSWORD] = input;
    });

    form.buttonText = 'Sign Up';
    form.linkText = 'Already have an account?';

    const configCreator = (formData) =>{
      return new FormValidationConfigBuilder()
          .addField(EMAIL,
              validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`),
              validateByRegexp(EMAIL_VALIDATION_REGEX, 'Allowed only a-Z and +.-_@ .'))
          .addField(PASSWORD,
              validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`))
          .addField(CONFIRM_PASSWORD,
              validateSameValue(formData.get(PASSWORD),
                  'Passwords don\'t match.'))
          .build();
    };

    form.onSubmit((formData) => {
      this.#validateForm(formData, configCreator);
    });
  }

  #validateForm(formData, configCreator) {
    Object.entries(this._formControls).forEach(([name, formControl]) => {
      formControl.saveValue();
      formControl.clearErrorMessages();
    });

    new ValidationService()
        .validate(formData, configCreator(formData))
        .catch((result) => {
          result.errors.forEach((error) => {
            this._formControls[error.name].addErrorMessage(error.message);
          });
        });
  }

  /**
   * Returns authorization form's HTML as string.
   *
   * @returns {string}
   */
  markup() {
    return this.addSlot('form');
  }
}

