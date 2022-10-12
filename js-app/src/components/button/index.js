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
   * @param {string} text
   */
  set title(text) {
    this.#title = text;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <button class="btn btn-primary" title="${this.#title}">${this.#title}</button>
    `;
  }
}
