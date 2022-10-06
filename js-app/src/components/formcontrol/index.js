import {Component} from '../component.js';

/**
 * Form control component.
 */
export class FormControl extends Component {
  /**
   * @param {string} id
   */
  set inputId(id) {
    this.rootElement.getElementsByTagName('input')[0].id = id;
    this.rootElement.getElementsByTagName('input')[0].name = id;
    this.rootElement.getElementsByTagName('label')[0].htmlFor = id;
  }

  /**
   * @param {string} type
   */
  set inputType(type) {
    this.rootElement.getElementsByTagName('input')[0].type = type;
  }

  /**
   * @param {string} text
   */
  set inputPlaceholder(text) {
    this.rootElement.getElementsByTagName('input')[0].placeholder = text;
  }

  /**
   * @param {string} text
   */
  set labelText(text) {
    this.rootElement.getElementsByTagName('label')[0].innerText = text;
  }

  /**
   * Returns form-control's HTML as string.
   *
   * @returns {string}
   */
  mockup() {
    return `
    <div class="form-group">
                <div class="col-sm-4 label-holder">
                    <label class="control-label">LabelText</label>
                </div>
                <div class="col-sm-8">
                    <input class="form-control" placeholder="InputPlaceholder" type="text" name="InputName">
                </div>
            </div>
    `;
  }
}
