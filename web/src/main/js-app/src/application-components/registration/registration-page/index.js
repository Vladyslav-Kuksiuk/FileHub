import {Component} from '../../../components/component';
import {RegistrationForm} from '../registration-form';
import {FieldValidationError} from '../../../server-connection/field-validation-error';
import {inject} from '../../../registry.js';
import {EMAIL_ADDRESS} from "../../../storage-service.js";

const NAVIGATE_EVENT_CONFIRMATION_EMAIL_SENT = 'NAVIGATE_EVENT_CONFIRMATION_EMAIL_SENT';
const NAVIGATE_EVENT_LOGIN = 'NAVIGATE_EVENT_LOGIN';

/**
 * Registration page component.
 */
export class RegistrationPage extends Component {
  #eventTarget = new EventTarget();
  @inject apiService;
  @inject titleService;
  @inject storageService;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.titleService.setTitles(['Sign Up']);
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const formSlot = this.getSlot('form');
    const form = new RegistrationForm(formSlot);
    form.onNavigateToAuthorization(()=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_LOGIN));
    });
    form.onSubmit((data)=>{
      this.storageService.put(EMAIL_ADDRESS, data.login)
      this.apiService.register(data)
          .then(()=>{
            this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_CONFIRMATION_EMAIL_SENT));
          })
          .catch((error)=>{
            if (error instanceof FieldValidationError) {
              const errors = {};
              error.fieldErrors.forEach((fieldError) =>{
                const prevErrors = errors[fieldError.fieldName] || [];
                errors[fieldError.fieldName] = [...prevErrors, fieldError.errorText];
              });
              form.formErrors = errors;
            } else {
              form.setHeadError(error.message);
            }
          });
    });
  }

  /**
   * Adds listener on navigate to email confirmation sent event.
   *
   * @param {Function} listener
   */
  onNavigateToLogin(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_LOGIN, listener);
  }

  /**
   * Adds listener on navigate to email confirmation sent event.
   *
   * @param {Function} listener
   */
  onNavigateToEmailConfirmationSent(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT_CONFIRMATION_EMAIL_SENT, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Sign up to FileHub</h1>
        <hr class="horizontal-line">
        ${this.addSlot('form')}
    </main>
</div>
    `;
  }
}
