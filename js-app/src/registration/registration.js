import {RegistrationValidator} from './registration-validator.js';

const form = document.getElementsByTagName('form')[0];
const formValidator = new RegistrationValidator();

formValidator.addValidationToForm(form);
