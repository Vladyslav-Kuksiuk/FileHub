import {Component} from '../../../components/component';
import {FormControl} from '../../../components/form-control';
import {Form} from '../../../components/form';
import {FormValidationConfigBuilder} from '../../../validation/form-validation-config';
import {validateByRegexp, validateLength, validateSameValue} from '../../../validation/value-validations';
import {ValidationService} from '../../../validation/validation-service';
import {Link} from '../../../components/link';
import {UserData} from '../../../user-data';

export const EMAIL = 'email';
export const PASSWORD = 'password';
export const CONFIRM_PASSWORD = 'confirm-password';
const EMAIL_MIN_LENGTH = 6;
const PASSWORD_MIN_LENGTH = 8;
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_VALIDATION_REGEX = /^[a-zA-Z0-9]+$/;
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
              validateByRegexp(EMAIL_VALIDATION_REGEX, 'Email must be real.'))
          .addField(PASSWORD,
              validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`),
              validateByRegexp(PASSWORD_VALIDATION_REGEX, 'Allowed only a-Z and 0-9.')
              )
          .addField(CONFIRM_PASSWORD,
              validateSameValue(formData.get(PASSWORD),
                  'Passwords don\'t match.'))
          .build();
    };

    form.onSubmit((formData) => {
      this.#emailValue = formData.get(EMAIL);
      this.#passwordValue = formData.get(PASSWORD);
      this.#confirmValue = formData.get(CONFIRM_PASSWORD);
      this.#headError = null;

      this.#validateForm(formData, configCreator)
          .then(() => {
            this.#eventTarget.dispatchEvent(new Event(SUBMIT_EVENT));
          })
          .catch(()=>{});
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
   * @param {Function} configCreator
   * @returns {Promise<void>}
   * @private
   */
  #validateForm(formData, configCreator) {
    this.formErrors ={
      [EMAIL]: [],
      [PASSWORD]: [],
      [CONFIRM_PASSWORD]: [],
    };
    return new ValidationService()
        .validate(formData, configCreator(formData))
        .catch((result) => {
          const errorsByField = result.errors.reduce((tempErrors, error)=>{
            const fieldName = error.name;
            const prevErrors = tempErrors[fieldName] || [];
            tempErrors[fieldName] = [...prevErrors, error.message];
            return tempErrors;
          }, {});
          this.formErrors = errorsByField;
          throw new Error();
        });
  }

  /**
   * @inheritDoc
   */
  markup() {
    const error = this.#headError ? `<p class="text-danger"> ${this.#headError} </p>` : '';
    return `
    <slot ${this.markElement('head-error')} >${error}</slot>
    ${this.addSlot('form')}
    `;
  }
}

