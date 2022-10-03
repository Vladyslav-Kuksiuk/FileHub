import {validateLength} from './value-validations.js';
import {EMAIL, EMAIL_MIN_LENGTH, PASSWORD, PASSWORD_MIN_LENGTH} from '../constants.js';
import {FormValidationConfigBuilder} from './form-validation-config.js';

import {FormValidator} from './form-validator.js';

/**
 * Class to add configured validation on authorization form.
 */
class AuthorizationValidation extends FormValidator {
  /**
   *  Creates {@link FormValidationConfig} for authorization form.
   *
   * @param {FormData} formData
   * @returns {FormValidationConfig}
   */
  createValidationConfig(formData) {
    return new FormValidationConfigBuilder()
        .addField(EMAIL,
            validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`))
        .addField(PASSWORD,
            validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD} symbols.`))
        .build();
  }
}

const form = document.getElementsByTagName('form')[0];
const formValidator = new AuthorizationValidation();

formValidator.addValidationToForm(form);
