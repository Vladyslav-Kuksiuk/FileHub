import {AuthorizationValidator} from './authorization-validator.js';
import {Button} from '../components/button';
import {FormControl} from '../components/formcontrol';
import {EMAIL, PASSWORD} from '../constants.js';

const form = document.getElementsByTagName('form')[0];
const formValidator = new AuthorizationValidator();
formValidator.addValidationToForm(form);

const formControlHolder = form.getElementsByClassName('form-control-holder')[0];
const emailFormControl = new FormControl(formControlHolder);
emailFormControl.inputId = EMAIL;
emailFormControl.inputType = 'text';
emailFormControl.inputPlaceholder = 'Email';
emailFormControl.labelText = 'Email';

const passwordFormControl = new FormControl(formControlHolder);
passwordFormControl.inputId = PASSWORD;
passwordFormControl.inputType = 'password';
passwordFormControl.inputPlaceholder = 'Password';
passwordFormControl.labelText = 'Password';

const buttonPlace = document.getElementsByClassName('button-place')[0];
const button = new Button(buttonPlace);
button.title = 'Sign in';
