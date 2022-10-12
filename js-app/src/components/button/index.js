import {Component} from '../component.js';

/**
 * Button component.
 */
export class Button extends Component {
  #title;

  /**
   * @param {HTMLElement} parent
   * @param {string} title
   */
  constructor(parent, title) {
    super(parent);
    this.#title = title;
    this.init();
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <button class="btn btn-primary" title="${this.#title}" ${this.markElement('button-component')}>${this.#title}</button>
    `;
  }
}
