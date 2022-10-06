import {AuthorizationValidator} from './authorization-validator.js';

const form = document.getElementsByTagName('form')[0];
const formValidator = new AuthorizationValidator();

formValidator.addValidationToForm(form);
