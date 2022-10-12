import {Component} from '../component.js';
import {FormControl} from '../form-control';
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
  #formControls = {};

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * Adds form controls and button.
   */
  afterRender() {
    const form = new Form(this.parentElement, {
      buttonText: 'Sign Up',
      linkText: 'Already have an account?',
    });

    form.addFormControl((slot) => {
      const input = new FormControl(slot, {
        name: EMAIL,
        labelText: 'Email',
        placeholder: 'Email',
      });
      this.#formControls[EMAIL] = input;
    });

    form.addFormControl((slot) => {
      const input = new FormControl(slot, {
        name: PASSWORD,
        labelText: 'Password',
        placeholder: 'Password',
        type: 'password',
      });
      this.#formControls[PASSWORD] = input;
    });

    form.addFormControl((slot) => {
      const input = new FormControl(slot, {
        name: CONFIRM_PASSWORD,
        labelText: 'Confirm Password',
        placeholder: 'Confirm Password',
        type: 'password',
      });
      this.#formControls[CONFIRM_PASSWORD] = input;
    });

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

  /**
   * Validates forms inputs and render errors.
   *
   * @param {FormData} formData
   * @param {function(FormData)} configCreator
   */
  #validateForm(formData, configCreator) {
    Object.entries(this.#formControls).forEach(([name, formControl]) => {
      formControl.saveValue();
      formControl.clearErrorMessages();
    });

    new ValidationService()
        .validate(formData, configCreator(formData))
        .catch((result) => {
          result.errors.forEach((error) => {
            this.#formControls[error.name].addErrorMessage(error.message);
          });
        });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return this.addSlot('form');
  }
}

