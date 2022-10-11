import {Component} from '../component.js';

/**
 * Authorization page component.
 */
export class FormPage extends Component {
  _headerText;
  _formCreator;

  /**
   * Adds authorization form to page.
   */
  afterRender() {
    this._formCreator ? this._formCreator(this.getSlot('form')) : '';
  }

  /**
   * Adds form to page.
   *
   * @param {function(HTMLElement)} formCreator
   */
  addForm(formCreator) {
    this._formCreator = formCreator;
    this.render();
  }

  /**
   * @param {string} text
   */
  set headerText(text) {
    this._headerText = text;
    this.render();
  }

  /**
   * Returns authorization page's HTML as string.
   *
   * @returns {string}
   */
  markup() {
    return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="TeamDev"><img alt="TeamDev" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>${this._headerText}</h1>
        <hr class="horizontal-line">
        ${this.addSlot('form')}
    </main>
</div>
    `;
  }
}
