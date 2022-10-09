import {ValidationService} from './validation-service.js';

/**
 * Abstract class to add configured validator on form.
 */
export class FormValidator {
  /**
   * Forbidden constructor (to make class abstract).
   */
  constructor() {
    if (this.constructor === FormValidator) {
      throw new Error(' Object of Abstract Class cannot be created');
    }
  }

  /**
   * Adds configured validation to form.
   * @param {Button} button
   * @param {[FormControl]} formControls
   */
  addValidationToForm(button, formControls) {
    button.rootElement.addEventListener('click', (event) => {
      event.preventDefault();

      formControls.forEach((formControl) =>{
        formControl.saveValue();
        formControl.clearErrorMessages();
      });

      new ValidationService()
          .validate(formControls, this.createValidationConfig())
          .catch((result) => {
            result.errors.forEach((error) =>{
              formControls.find((formControl) => formControl.name===error.name)
                  .addErrorMessage(error.message);
            });
          });
    });
  }

  /**
   * @param {FormData} formData
   * @abstract
   * @returns {FormValidationConfig}
   */
  createValidationConfig(formData) {
    throw new Error('Method of Abstract Class cannot be called');
  }
}
