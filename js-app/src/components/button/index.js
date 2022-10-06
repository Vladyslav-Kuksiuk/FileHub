import {Component} from '../component.js';

/**
 * Button component.
 */
export class Button extends Component {
  /**
   * @param {string} text
   */
  set title(text) {
    this.rootElement.innerText = text;
    this.rootElement.title = text;
  }

  /**
   * Returns button's HTML as string.
   *
   * @returns {string}
   */
  mockup() {
    return `
    <button class="btn btn-primary" title="Button">Button</button>
    `;
  }
}
