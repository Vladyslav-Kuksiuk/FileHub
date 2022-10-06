import {AuthorizationValidator} from './authorization-validator.js';
import {Button} from '../components/button';

const form = document.getElementsByTagName('form')[0];
const formValidator = new AuthorizationValidator();
formValidator.addValidationToForm(form);

const buttonPlace = document.getElementsByClassName('button-place')[0];
const button = new Button(buttonPlace);
button.title = 'Sign in';
