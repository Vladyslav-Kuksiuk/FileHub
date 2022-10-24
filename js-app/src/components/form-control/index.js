import {Component} from '../component';

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
   * @property {string} [value = ]
   * @property {[string]} [errorMessages = []]
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
        value = '',
        errorMessages = [],
      }) {
    super(parent);
    this.#name = name;
    this.#labelText = labelText;
    this.#placeholder = placeholder;
    this.#type = type;
    this.#value = value;
    this.#errorMessages = errorMessages;
    this.init();
  }

  /**
   * @inheritDoc
   */
  markup() {
    const errors = this.#errorMessages?.map((error) => {
      return `<p class="help-block text-danger" ${this.markElement('error-message')}>${error}</p>`;
    }).join(' ');

    return `
    <div class="form-group" ${this.markElement('form-control')}>
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
