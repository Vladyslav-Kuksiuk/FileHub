import {RegistrationValidator} from './registration-validator.js';
import {Button} from '../components/button';
import {FormControl} from '../components/formcontrol';
import {EMAIL, PASSWORD} from '../constants.js';

const form = document.getElementsByTagName('form')[0];
const formValidator = new RegistrationValidator();

formValidator.addValidationToForm(form);

const formControlHolder = form.getElementsByClassName('form-control-holder')[0];
const emailFormControl = new FormControl(formControlHolder);
emailFormControl.inputId = EMAIL;
emailFormControl.inputType = 'text';
emailFormControl.placeholder = 'Email';
emailFormControl.labelText = 'Email';

const passwordFormControl = new FormControl(formControlHolder);
passwordFormControl.inputId = PASSWORD;
passwordFormControl.inputType = 'password';
passwordFormControl.placeholder = 'Password';
passwordFormControl.labelText = 'Password';

const confirmFormControl = new FormControl(formControlHolder);
confirmFormControl.inputId = 'confirm-password';
confirmFormControl.inputType = 'password';
confirmFormControl.placeholder = 'Confirm Password';
confirmFormControl.labelText = 'Confirm Password';

const buttonPlace = document.getElementsByClassName('button-place')[0];
const button = new Button(buttonPlace);
button.title = 'Sign up';
