import {RegistrationValidator} from './registration-validator.js';
import {Button} from '../components/button';

const form = document.getElementsByTagName('form')[0];
const formValidator = new RegistrationValidator();

formValidator.addValidationToForm(form);

const buttonPlace = document.getElementsByClassName('button-place')[0];
const button = new Button(buttonPlace);
button.title = 'Sign up';
