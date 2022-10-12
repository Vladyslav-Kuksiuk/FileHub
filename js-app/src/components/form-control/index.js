import {Component} from '../component.js';

/**
 * Form control component.
 */
export class FormControl extends Component {
  #errorMessages = [];
  #labelText;
  #type;
  #name;
  #placeholder;
  #id = crypto.randomUUID();
  #value = '';

  /**
   * @typedef {Object} FormControlConfig
   * @property {string} name
   * @property {string} labelText
   * @property {string} [placeholder = ]
   * @property {string} [type = text]
   */

  /**
   * @param {HTMLElement} parent
   * @param {FormControlConfig} config
   */
  constructor(parent,
      {
        name,
        labelText,
        placeholder = '',
        type = 'text',
      }) {
    super(parent);
    this.#name = name;
    this.#labelText = labelText;
    this.#placeholder = placeholder;
    this.#type = type;
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
                     placeholder="${this.#placeholder}" type="${this.#type}"
                     name="${this.#name}" value="${this.#value}">
                     ${errors ?? ''}
                </div>
            </div>
    `;
  }
}
