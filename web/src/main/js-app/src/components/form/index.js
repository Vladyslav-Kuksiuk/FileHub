import {Component} from '../component';
import {Button} from '../button';

const FORM_SUBMIT_EVENT = 'FORM_SUBMIT_EVENT';
/**
 * Form component.
 */
export class Form extends Component {
  #buttonText;
  #linkCreator;
  #inputCreators = [];

  #eventTarget = new EventTarget();

  /**
   * @typedef {object} FormConfig
   * @property {string} buttonText
   * @property {function(HTMLElement)} linkCreator
   */

  /**
   * @param {HTMLElement} parent
   * @param {FormConfig} config
   */
  constructor(parent, {
    buttonText,
    linkCreator,
  }) {
    super(parent);
    this.#buttonText = buttonText;
    this.#linkCreator = linkCreator;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const buttonSlot = this.getSlot('button');
    new Button(buttonSlot, this.#buttonText);

    const linkSlot = this.getSlot('link');
    this.#linkCreator?.(linkSlot);

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
   * @param {function(HTMLElement): void} inputCreator
   */
  addFormControl(inputCreator) {
    this.#inputCreators.push(inputCreator);
    this.render();
  }

  /**
   * Adds listener on form submit event.
   *
   * @param {function(FormData): void} listener
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
        <form ${this.markElement('form-component')} action="" class="form-horizontal form-page">
            ${this.addSlot('inputs')}
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    ${this.addSlot('button')}
                    ${this.addSlot('link')}
                </div>
            </div>
        </form>
    `;
  }
}
