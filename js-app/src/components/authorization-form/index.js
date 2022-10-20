import {Component} from '../component';
import {FormControl} from '../form-control';
import {Form} from '../form';
import {FormValidationConfigBuilder} from '../../validation/form-validation-config';
import {validateLength} from '../../validation/value-validations';
import {ValidationService} from '../../validation/validation-service';
import {Link} from '../link';

const EMAIL = 'email';
const PASSWORD = 'password';
const EMAIL_MIN_LENGTH = 5;
const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_LENGTH_ERROR = `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`;
export const PASSWORD_LENGTH_ERROR = `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`;

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';

/**
 * Authorization page component.
 */
export class AuthorizationForm extends Component {
  #formControls = {};
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
      link.onClick(()=>{
        this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
      });
    };

    const form = new Form(this.parentElement, {
      buttonText: 'Sign In',
      linkCreator: linkCreator,
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
   * Adds event listener on navigate to registration.
   * @param {function} listener
   */
  onNavigateToRegistration(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
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
