import {validateLength} from '../validation/value-validations.js';
import {EMAIL, EMAIL_MIN_LENGTH, PASSWORD, PASSWORD_MIN_LENGTH} from '../constants.js';
import {FormValidationConfigBuilder} from '../validation/form-validation-config.js';

import {FormValidator} from '../validation/form-validator.js';

/**
 * Class to add configured validation on authorization form.
 */
export class AuthorizationValidator extends FormValidator {
  /**
   *  Creates {@link FormValidationConfig} for authorization form.
   *
   * @param {[FormControl]} formControls
   * @returns {FormValidationConfig}
   */
  createValidationConfig(formControls) {
    return new FormValidationConfigBuilder()
        .addField(EMAIL,
            validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`))
        .addField(PASSWORD,
            validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`))
        .build();
  }
}
