import {Component} from '../component.js';
import {FormControl} from '../form-control';
import {Form} from '../form';
import {FormValidationConfigBuilder} from '../../validation/form-validation-config.js';
import {validateLength} from '../../validation/value-validations.js';
import {ValidationService} from '../../validation/validation-service.js';

const EMAIL = 'email';
const PASSWORD = 'password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;

/**
 * Authorization page component.
 */
export class AuthorizationForm extends Component {
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
      buttonText: 'Sign In',
      linkText: 'Don\'t have an account yet?',
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

    const configCreator = (formData) =>{
      return new FormValidationConfigBuilder()
          .addField(EMAIL,
              validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`))
          .addField(PASSWORD,
              validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`))
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