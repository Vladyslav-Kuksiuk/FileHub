import {Component} from '../../../components/component';
import {FormControl} from '../../../components/form-control';
import {Form} from '../../../components/form';
import {FormValidationConfigBuilder} from '../../../validation/form-validation-config';
import {validateLength} from '../../../validation/value-validations';
import {ValidationService} from '../../../validation/validation-service';
import {Link} from '../../../components/link';
import {UserData} from '../../../user-data';

export const EMAIL = 'email';
export const PASSWORD = 'password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;

const SUBMIT_EVENT = 'SUBMIT_EVENT';

/**
 * Administrator authorization form component.
 */
export class AdminAuthorizationForm extends Component {
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

    const form = new Form(this.rootElement, {
      buttonText: 'Sign In'
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
   * @param {Function} configCreator
   * @returns {Promise<void>}
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
          throw new Error();
        });
  }

  /**
   * @inheritDoc
   */
  markup() {
    const error = this.#headError ? `<p class="text-danger">${this.#headError}</p>` : '';
    return `
    <slot ${this.markElement('head-error')}>${error}</slot>
    ${this.addSlot('auth-form')}
    `;
  }
}
