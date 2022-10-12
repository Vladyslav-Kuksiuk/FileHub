import {Component} from '../component.js';
import {Button} from '../button';

const FORM_SUBMIT_EVENT = 'formSubmitEvent';

/**
 * Authorization page component.
 */
export class Form extends Component {
  #buttonText;
  #linkText;
  #inputCreators = [];
  #eventTarget = new EventTarget();

  /**
   * @typedef {Object} FormConfig
   * @property {string} buttonText
   * @property {string} linkText
   */

  /**
   * @param {HTMLElement} parent
   * @param {FormConfig} config
   */
  constructor(parent, {
    buttonText,
    linkText,
  }) {
    super(parent);
    this.#buttonText = buttonText;
    this.#linkText = linkText;
    this.init();
  }

  /**
   * Adds form controls and button.
   */
  afterRender() {
    const buttonSlot = this.getSlot('button');
    new Button(buttonSlot, this.#buttonText);

    const these = this;
    this.#inputCreators.forEach((creator) => {
      const slot = these.getSlot('inputs');
      creator(slot);
    });

    this.rootElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(FORM_SUBMIT_EVENT));
    });
  }

  /**
   * Adds form control to form.
   *
   * @param {function(HTMLElement)} inputCreator
   */
  addFormControl(inputCreator) {
    this.#inputCreators.push(inputCreator);
    this.render();
  }

  /**
   * Adds onSubmit event to form.
   *
   * @param {function(FormData)} listener
   */
  onSubmit(listener) {
    this.#eventTarget.addEventListener(FORM_SUBMIT_EVENT, (event) => {
      const formData = new FormData(this.rootElement);
      listener(formData);
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
        <form ${this.markElement('form')} action="" class="form-horizontal form-page">
            ${this.addSlot('inputs')}
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    ${this.addSlot('button')}
                    <a class="form-link" href="" title="${this.#linkText}">${this.#linkText}</a>
                </div>
            </div>
        </form>
    `;
  }
}
