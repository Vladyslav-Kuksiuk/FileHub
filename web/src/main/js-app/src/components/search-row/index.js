import {Component} from '../component';

const BUTTON_CLICK_EVENT = 'CLICK_EVENT';
const BUTTON = 'search-button';
const INPUT = 'search-input';

/**
 * SearchRow component.
 */
export class SearchRow extends Component {
  #isLoading = false;
  #error;
  #inputValue = '';
  #eventTarget = new EventTarget();
  #placeholder

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent, placeholder) {
    super(parent);
    this.#placeholder = placeholder
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.querySelector(`[data-td="${BUTTON}"]`).addEventListener('click', (event)=>{
      event.preventDefault();
      this.#inputValue = this.rootElement.querySelector(`[data-td="${INPUT}"]`).value;
      this.#eventTarget.dispatchEvent(new Event(BUTTON_CLICK_EVENT));
    });
  }

  /**
   * @param {boolean} isLoading
   */
  set isLoading(isLoading) {
    this.#isLoading = isLoading;
    this.#inputValue = '';
    this.render();
  }

  /**
   * @param {string | null} error
   */
  set error(error) {
    this.#error = error;
    this.render();
  }

  /**
   * Adds listener on search button click event.
   *
   * @param {function(string)} listener
   */
  onSearchClick(listener) {
    this.#eventTarget.addEventListener(BUTTON_CLICK_EVENT, () => {
      const inputValue = this.rootElement.querySelector(`[data-td="${INPUT}"]`).value;
      listener(inputValue);
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    const error = `<p class="help-block text-danger">${this.#error}</p>`;
    return `<div>
  <div class="input-group search-line">
    <input ${this.markElement(INPUT)} class="form-control ${this.#error ? 'input-error' : ''}" 
           id="search" name="Search" value="${this.#inputValue}"
           placeholder="${this.#placeholder}" type="text"
           ${this.#isLoading ? 'disabled' : ''}>
    <span class="input-group-btn">
      <button ${this.markElement(BUTTON)} class="btn btn-primary" title="Search" type="button"
              ${this.#isLoading ? 'disabled' : ''}>
          ${this.#isLoading ? '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>' : ''}Search
      </button>
    </span>
  </div>
  ${this.#error ? error : ''}
</div>`;
  }
}
