import {Component} from '../component';
import {FormControl} from '../form-control';
import {Form} from '../form';
import {FormValidationConfigBuilder} from '../../validation/form-validation-config';
import {validateByRegexp, validateLength, validateSameValue} from '../../validation/value-validations';
import {ValidationService} from '../../validation/validation-service';
import {Link} from '../link';
import {UserData} from '../../user-data';

export const EMAIL = 'email';
export const PASSWORD = 'password';
export const CONFIRM_PASSWORD = 'confirm-password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z\d+.\-_@]+$/;
export const EMAIL_LENGTH_ERROR = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
export const PASSWORD_LENGTH_ERROR = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;
export const EMAIL_VALIDATION_ERROR = 'Allowed only a-Z and +.-_@ .';
export const PASSWORD_MATCH_ERROR = 'Passwords don\'t match.';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';
const SUBMIT_EVENT = 'SUBMIT_EVENT';

/**
 * Registration form component.
 */
export class RegistrationForm extends Component {
  #emailValue = '';
  #passwordValue = '';
  #confirmValue = '';
  #formErrors = {
    [EMAIL]: [],
    [PASSWORD]: [],
    [CONFIRM_PASSWORD]: [],
  };
  #eventTarget = new EventTarget();
  #headError;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const linkCreator = (slot) => {
      const link = new Link(slot, 'Already have an account?');
      link.onClick(() => {
        this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
      });
    };

    const form = new Form(this.rootElement, {
      buttonText: 'Sign Up',
      linkCreator: linkCreator,
    });

    form.addFormControl((slot) => {
      new FormControl(slot, {
        name: EMAIL,
        labelText: 'Email',
        placeholder: 'Email',
        value: this.#emailValue,
        errorMessages: this.#formErrors[EMAIL],
      });
    });

    form.addFormControl((slot) => {
      new FormControl(slot, {
        name: PASSWORD,
        labelText: 'Password',
        placeholder: 'Password',
        type: 'password',
        value: this.#passwordValue,
        errorMessages: this.#formErrors[PASSWORD],
      });
    });

    form.addFormControl((slot) => {
      new FormControl(slot, {
        name: CONFIRM_PASSWORD,
        labelText: 'Confirm Password',
        placeholder: 'Confirm Password',
        type: 'password',
        value: this.#confirmValue,
        errorMessages: this.#formErrors[CONFIRM_PASSWORD],
      });
    });

    const configCreator = (formData) => {
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
      this.#emailValue = formData.get(EMAIL);
      this.#passwordValue = formData.get(PASSWORD);
      this.#confirmValue = formData.get(CONFIRM_PASSWORD);
      this.#validateForm(formData, configCreator);
    });
  }

  /**
   * @param {object} errors
   */
  set formErrors(errors) {
    this.#formErrors = errors;
    this.render();
  }

  /**
   * Adds listener on navigate to authorization event.
   *
   * @param {Function} listener
   */
  onNavigateToAuthorization(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
  }

  /**
   * Adds listener on form submit event.
   *
   * @param {Function} listener
   */
  onSubmit(listener) {
    this.#eventTarget.addEventListener(SUBMIT_EVENT, ()=>{
      listener(new UserData(
          this.#emailValue,
          this.#passwordValue,
      ));
    });
  }

  /**
   * Sets head error.
   *
   * @param {string} error
   */
  setHeadError(error) {
    this.#headError = error;
    this.render();
  }

  /**
   * @param {FormData} formData
   * @param {function(FormData)} configCreator
   * @private
   */
  #validateForm(formData, configCreator) {
    this.formErrors ={
      [EMAIL]: [],
      [PASSWORD]: [],
      [CONFIRM_PASSWORD]: [],
    };
    new ValidationService()
        .validate(formData, configCreator(formData))
        .then(() => {
          this.#eventTarget.dispatchEvent(new Event(SUBMIT_EVENT));
        })
        .catch((result) => {
          const errorsByField = result.errors.reduce((tempErrors, error)=>{
            const fieldName = error.name;
            const prevErrors = tempErrors[fieldName] || [];
            tempErrors[fieldName] = [...prevErrors, error.message];
            return tempErrors;
          }, {});
          this.formErrors = errorsByField;
        });
  }

  /**
   * @inheritDoc
   */
  markup() {
    const error = this.#headError ? `<p class="text-danger">${this.#headError}</p>` : '';

    return `
    ${error}
    ${this.addSlot('form')}
    `;
  }
}

