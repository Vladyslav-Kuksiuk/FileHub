import {Component} from '../component.js';
import {FormControl} from '../formcontrol';
import {EMAIL, PASSWORD} from '../../constants.js';
import {Form} from "../form";

/**
 * Authorization page component.
 */
export class AuthorizationForm extends Component {
  /**
   * Adds form controls and button.
   */
  afterRender() {
    const form = new Form(this.parentElement);

    form.addInput((slot) =>{
      const input = new FormControl(slot);
      input.name = EMAIL;
      input.labelText = 'Email';
      input.placeholder = 'Email';
    })

    form.addInput((slot) =>{
      const input = new FormControl(slot);
      input.name = PASSWORD;
      input.labelText = 'Password';
      input.placeholder = 'Password';
    })

    form.buttonText = 'Sign In'
    form.linkText = 'Don\'t have an account yet?'

    //new AuthorizationValidator().addValidationToForm(button, [emailInput, passwordInput]);
  }

  /**
   * Returns button's HTML as string.
   *
   * @returns {string}
   */
  markup() {
    return `${this.addSlot('form')}`;
  }
}
