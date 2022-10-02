import {validateByRegex, validateLength} from './value-validations.js';
import {EMAIL, EMAIL_MIN_LENGTH, EMAIL_VALIDATION_REGEX, PASSWORD, PASSWORD_MIN_LENGTH} from '../constants.js';
import {FormValidationConfigBuilder} from './form-validation-config.js';
import {formOnsubmitValidation} from './form-onsubmit-validation.js';

const form = document.getElementsByTagName('form')[0];
const authorizationValidationConfig = new FormValidationConfigBuilder()
    .addField(EMAIL, validateLength(EMAIL_MIN_LENGTH), validateByRegex(EMAIL_VALIDATION_REGEX))
    .addField(PASSWORD, validateLength(PASSWORD_MIN_LENGTH))
    .build();

formOnsubmitValidation(form, authorizationValidationConfig);
