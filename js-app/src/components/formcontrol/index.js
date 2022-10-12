import {Component} from '../component.js';

/**
 * Form control component.
 */
export class FormControl extends Component {
  #errorMessages = [];
  #labelText;
  #type = 'text';
  #name;
  #placeHolder;
  #id = crypto.randomUUID();
  #value = '';

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   *  Adds error message to input.
   * @param {string} errorMessage
   */
  addErrorMessage(errorMessage) {
    this.#errorMessages.push(errorMessage);
    this.render();
  }

  /**
   * Clear all error messages from input.
   */
  clearErrorMessages() {
    this.#errorMessages = [];
    this.render();
  }

  /**
   * @param {string} text
   */
  set labelText(text) {
    this.#labelText = text;
    this.render();
  }

  /**
   * @param {string} type
   */
  set inputType(type) {
    this.#type = type;
    this.render();
  }

  /**
   * @param {string} text
   */
  set placeholder(text) {
    this.#placeHolder = text;
    this.render();
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.#name = name;
    this.render();
  }

  /**
   * Saves value from user input.
   */
  saveValue() {
    this.#value = document.getElementById(this.#id).value;
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.#value;
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.#value = value;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    const errors = this.#errorMessages?.map((error) => {
      return `<p class="help-block text-danger">${error}</p>`;
    }).join(' ');

    return `
    <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label for="${this.#id}" class="control-label">${this.#labelText}</label>
                </div>
                <div class="col-sm-8">
                    <input id="${this.#id}" class="form-control ${errors ? 'input-error' : ''}"
                     placeholder="${this.#placeHolder}" type="${this.#type}"
                     name="${this.#name}" value="${this.#value}">
                     ${errors ?? ''}
                </div>
            </div>
    `;
  }
}
