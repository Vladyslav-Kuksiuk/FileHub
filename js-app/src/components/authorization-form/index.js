import {Component} from '../component';
import {FormControl} from '../form-control';
import {Form} from '../form';
import {FormValidationConfigBuilder} from '../../validation/form-validation-config';
import {validateLength} from '../../validation/value-validations';
import {ValidationService} from '../../validation/validation-service';
import {Link} from '../link';
import {UserData} from '../../user-data';

export const EMAIL = 'email';
export const PASSWORD = 'password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_LENGTH_ERROR = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
export const PASSWORD_LENGTH_ERROR = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';
const SUBMIT_EVENT = 'SUBMIT_EVENT';

/**
 * Authorization form component.
 */
export class AuthorizationForm extends Component {
  #emailValue = '';
  #passwordValue = '';
  #formErrors = {
    [EMAIL]: [],
    [PASSWORD]: [],
  };
  #headError;
  #eventTarget = new EventTarget();

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
      const link = new Link(slot, 'Don\'t have an account yet?');
      link.onClick(() => {
        this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
      });
    };

    const form = new Form(this.rootElement, {
      buttonText: 'Sign In',
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

    const configCreator = (formData) => {
      return new FormValidationConfigBuilder()
          .addField(EMAIL,
              validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`))
          .addField(PASSWORD,
              validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`))
          .build();
    };

    form.onSubmit((formData) => {
      this.#emailValue = formData.get(EMAIL);
      this.#passwordValue = formData.get(PASSWORD);
      this.#headError = null;

      this.#validateForm(formData, configCreator)
          .then(()=>{
            this.#eventTarget.dispatchEvent(new Event(SUBMIT_EVENT));
          })
          .catch(()=>{});
    });
  }

  /**
   * @param {object} errors
   * @private
   */
  #setFormErrors(errors) {
    this.#formErrors = errors;
    this.render();
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
   * Adds listener on navigate to registration event.
   *
   * @param {Function} listener
   */
  onNavigateToRegistration(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
  }

  /**
   * Adds listener on form submit event.
   *
   * @param {function(UserData)} listener
   */
  onSubmit(listener) {
    this.#eventTarget.addEventListener(SUBMIT_EVENT, () =>{
      listener(new UserData(
          this.#emailValue,
          this.#passwordValue,
      ));
    });
  }

  /**
   * @param {FormData} formData
   * @param {function(FormData)} configCreator
   * @returns {*|Promise<void | Promise>}
   * @private
   */
  #validateForm(formData, configCreator) {
    this.#setFormErrors({
      [EMAIL]: [],
      [PASSWORD]: [],
    });
    return new ValidationService()
        .validate(formData, configCreator(formData))
        .catch((result) => {
          const errorsByField = result.errors.reduce((tempErrors, error) => {
            const fieldName = error.name;
            const prevErrors = tempErrors[fieldName] || [];
            tempErrors[fieldName] = [...prevErrors, error.message];
            return tempErrors;
          }, {});
          this.#setFormErrors(errorsByField);
          return Promise.reject(new Error());
        });
  }

  /**
   * @inheritDoc
   */
  markup() {
    const error = this.#headError ? `<p class="text-danger">${this.#headError}</p>` : '';
    return `
    <slot>${error}</slot>
    ${this.addSlot('auth-form')}
    `;
  }
}
