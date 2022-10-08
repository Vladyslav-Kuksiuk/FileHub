import {Component} from '../component.js';

/**
 * Form control component.
 */
export class FormControl extends Component {
  _errorMessages;
  _labelText;
  _type = 'text';
  _name;
  _placeHolder;
  _id = crypto.randomUUID();

  /**
   * @param {[string]} errorMessages
   */
  set errorMessages(errorMessages) {
    this._errorMessages = errorMessages;
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

  set name(name) {
    this._name = name;
    this.render();
  }

  /**
   * Returns form-control's HTML as string.
   *
   * @returns {string}
   */
  markup() {
    const errors = this._errorMessages?.map((error)=>{
      return `<p class="help-block error-message">${error}</p>`;
    }).join(' ');

    return `
    <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label for="${this._id}" class="control-label">${this._labelText}</label>
                </div>
                <div class="col-sm-8">
                    <input id="${this._id}" class="form-control" placeholder="${this._placeHolder}"
                     type="${this._type}" name="${this._name}">
                </div>
            </div>
            ${errors ?? ''}
    `;
  }
}
