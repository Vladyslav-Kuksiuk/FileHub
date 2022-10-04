import {validateByRegexp, validateLength, validateSameValue} from './value-validations.js';
import {
  CONFIRM_PASSWORD,
  EMAIL,
  EMAIL_MIN_LENGTH,
  EMAIL_VALIDATION_REGEX,
  PASSWORD,
  PASSWORD_MIN_LENGTH,
} from '../constants.js';
import {FormValidationConfigBuilder} from './form-validation-config.js';
import {FormValidator} from './form-validator.js';

/**
 * Class to add configured validation on registration form.
 */
class RegistrationValidator extends FormValidator {
  /**
   *  Creates {@link FormValidationConfig} for registration form.
   *
   * @param {FormData} formData
   * @returns {FormValidationConfig}
   */
  createValidationConfig(formData) {
    return new FormValidationConfigBuilder()
        .addField(EMAIL,
            validateLength(EMAIL_MIN_LENGTH, `Length must be at least ${EMAIL_MIN_LENGTH} symbols.`),
            validateByRegexp(EMAIL_VALIDATION_REGEX, 'Allowed only a-Z and +.-_@ .'))
        .addField(PASSWORD,
            validateLength(PASSWORD_MIN_LENGTH, `Length must be at least ${PASSWORD_MIN_LENGTH} symbols.`))
        .addField(CONFIRM_PASSWORD,
            validateSameValue(formData.get(PASSWORD), 'Passwords don\'t match.'))
        .build();
  }
}

const form = document.getElementsByTagName('form')[0];
const formValidator = new RegistrationValidator();

formValidator.addValidationToForm(form);
