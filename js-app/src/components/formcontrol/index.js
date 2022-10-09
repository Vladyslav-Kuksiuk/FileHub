import {Component} from '../component.js';

/**
 * Form control component.
 */
export class FormControl extends Component {
  _errorMessages = [];
  _labelText;
  _type = 'text';
  _name;
  _placeHolder;
  _id = crypto.randomUUID();
  _value = '';

  /**
   *  Adds error message to input.
   * @param {string} errorMessage
   */
  addErrorMessage(errorMessage) {
    this._errorMessages.push(errorMessage);
    this.render();
  }

  /**
   * Clear all error messages from input.
   */
  clearErrorMessages() {
    this._errorMessages = [];
    this.render();
  }

  /**
   * @param {string} text
   */
  set labelText(text) {
    this._labelText = text;
    this.render();
  }

  /**
   * @param {string} type
   */
  set inputType(type) {
    this._type = type;
    this.render();
  }

  /**
   * @param {string} text
   */
  set placeholder(text) {
    this._placeHolder = text;
    this.render();
  }

  /**
   * @returns {string}
   */
  get name() {
    return this._name;
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this._name = name;
    this.render();
  }

  /**
   * Saves value from user input.
   */
  saveValue() {
    this._value = document.getElementById(this._id).value;
  }

  /**
   * @returns {string}
   */
  get value() {
    return this._value;
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this._value = value;
    this.render();
  }

  /**
   * Returns form-control's HTML as string.
   *
   * @returns {string}
   */
  markup() {
    const errors = this._errorMessages?.map((error) => {
      return `<p class="help-block text-danger">${error}</p>`;
    }).join(' ');

    return `
    <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label for="${this._id}" class="control-label">${this._labelText}</label>
                </div>
                <div class="col-sm-8">
                    <input id="${this._id}" class="form-control ${errors ? 'input-error' : ''}"
                     placeholder="${this._placeHolder}" type="${this._type}"
                     name="${this._name}" value="${this._value}">
                     ${errors ?? ''}
                </div>
            </div>
    `;
  }
}
