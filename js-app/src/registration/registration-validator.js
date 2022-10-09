import {validateByRegexp, validateLength, validateSameValue} from '../validation/value-validations.js';
import {
  CONFIRM_PASSWORD,
  EMAIL,
  EMAIL_MIN_LENGTH,
  EMAIL_VALIDATION_REGEX,
  PASSWORD,
  PASSWORD_MIN_LENGTH,
} from '../constants.js';
import {FormValidationConfigBuilder} from '../validation/form-validation-config.js';
import {FormValidator} from '../validation/form-validator.js';

/**
 * Class to add configured validation on registration form.
 */
export class RegistrationValidator extends FormValidator {
  /**
   *  Creates {@link FormValidationConfig} for registration form.
   *
   * @param {[FormControl]} formControls
   * @returns {FormValidationConfig}
   */
  createValidationConfig(formControls) {
    return new FormValidationConfigBuilder()
        .addField(EMAIL,
            validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`),
            validateByRegexp(EMAIL_VALIDATION_REGEX, 'Allowed only a-Z and +.-_@ .'))
        .addField(PASSWORD,
            validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`))
        .addField(CONFIRM_PASSWORD,
            validateSameValue(formControls.find((formControl) => formControl.name === PASSWORD).value,
                'Passwords don\'t match.'))
        .build();
  }
}
