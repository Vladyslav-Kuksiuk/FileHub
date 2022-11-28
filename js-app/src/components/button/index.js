import {Component} from '../component';

const CLICK_EVENT = 'CLICK_EVENT';
export const BUTTON_TYPE = {
  DEFAULT: 'btn-default',
  PRIMARY: 'btn-primary',
  DANGER: 'btn-danger',
};

/**
 * Button component.
 */
export class Button extends Component {
  #text;
  #title;
  #type;
  #isDisabled;
  #eventTarget = new EventTarget();

  /**
   * @typedef ButtonConfig
   * @property {string} text
   * @property {string} title
   * @property {string} type
   * @property {boolean} isDisabled
   */

  /**
   * @param {HTMLElement} parent
   * @param {ButtonConfig} config
   */
  constructor(parent, {
    text = '',
      title = '',
      type = BUTTON_TYPE.DEFAULT,
      isDisabled = false,
  }) {
    super(parent);
    this.#text = text;
    this.#title = title;
    this.#type = type;
    this.#isDisabled = isDisabled;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.addEventListener('click', ()=>{
      this.#eventTarget.dispatchEvent(new Event(CLICK_EVENT));
    });
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this.#text = text;
    this.render();
  }

  /**
   * @param {string} title
   */
  set title(title) {
    this.#title = title;
    this.render();
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.#type = type;
    this.render();
  }

  /**
   * @param {boolean} isDisabled
   */
  set isDisabled(isDisabled) {
    this.#isDisabled = isDisabled;
    this.render();
  }

  /**
   * Adds listener on click event.
   *
   * @param {Function} listener
   */
  onClick(listener) {
    this.#eventTarget.addEventListener(CLICK_EVENT, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <button class="btn ${this.#type}" title="${this.#title}" ${this.#isDisabled ? 'disabled' : ''}
            ${this.markElement('button-component')}>${this.#text}</button>
    `;
  }
}
