import {Component} from '../component.js';

/**
 * Button component.
 */
export class Button extends Component {
  _title;

  /**
   * @param {string} text
   */
  set title(text) {
    this._title = text;
    this.render();
  }

  /**
   * Returns button's HTML as string.
   *
   * @returns {string}
   */
  markup() {
    return `
    <button class="btn btn-primary" title="${this._title}">${this._title}</button>
    `;
  }
}
