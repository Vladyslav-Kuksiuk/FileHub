import {Component} from '../component';

const CLICK_EVENT = 'CLICK_EVENT';

/**
 * Link component.
 */
export class Link extends Component {
  #text;
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   * @param {string} text
   */
  constructor(parent, text) {
    super(parent);
    this.#text = text;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(CLICK_EVENT));
    });
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
     <a class="form-link" ${this.markElement('link-component')}
      href="#" title="${this.#text}">${this.#text}</a>
    `;
  }
}
