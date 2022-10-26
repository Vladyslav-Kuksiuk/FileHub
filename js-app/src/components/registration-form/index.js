import {Component} from '../component';
import {FormControl} from '../form-control';
import {Form} from '../form';
import {FormValidationConfigBuilder} from '../../validation/form-validation-config';
import {validateByRegexp, validateLength, validateSameValue} from '../../validation/value-validations';
import {ValidationService} from '../../validation/validation-service';
import {Link} from '../link';
import {UserData} from '../../user-data';

const EMAIL = 'email';
const PASSWORD = 'password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;
const CONFIRM_PASSWORD = 'confirm-password';
const EMAIL_VALIDATION_REGEX = /^[a-zA-Z\d+.\-_@]+$/;
export const EMAIL_LENGTH_ERROR = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
export const PASSWORD_LENGTH_ERROR = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;
export const EMAIL_VALIDATION_ERROR = 'Allowed only a-Z and +.-_@ .';
export const PASSWORD_MATCH_ERROR = 'Passwords don\'t match.';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';
const SUBMIT_EVENT = 'SUBMIT_EVENT';

/**
 * Authorization page component.
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

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * @inheritDoc.
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
      this.#validateForm(formData, configCreator).then(() => {
        this.#eventTarget.dispatchEvent(new Event(SUBMIT_EVENT));
      });
    });
  }

  /**
   * @private
   * @param {object} errors
   */
  #setFormErrors(errors) {
    this.#formErrors = errors;
    this.render();
  }

  /**
   * Adds event listener on navigate to authorization.
   *
   * @param {function} listener
   */
  onNavigateToAuthorization(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
  }

  /**
   * Adds event listener on form submit after validation.
   *
   * @param {function} listener
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
   * @private
   * @param {FormData} formData
   * @param {function(FormData)} configCreator
   * @returns {*|Promise<void | Promise>}
   */
  #validateForm(formData, configCreator) {
    this.#setFormErrors({
      [EMAIL]: [],
      [PASSWORD]: [],
      [CONFIRM_PASSWORD]: [],
    });
    return new ValidationService()
        .validate(formData, configCreator(formData))
        .catch((result) => {
          const errorsByField = result.errors.reduce((tempErrors, error)=>{
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
    return this.addSlot('form');
  }
}

