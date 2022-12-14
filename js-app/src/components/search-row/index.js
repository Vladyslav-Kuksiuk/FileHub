import {Component} from '../component';

const BUTTON_CLICK_EVENT = 'CLICK_EVENT';
const BUTTON = 'search-button';
const INPUT = 'search-input';

/**
 * SearchRow component.
 */
export class SearchRow extends Component {
  #isLoading = false;
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.querySelector(`[data-td="${BUTTON}"]`).addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(BUTTON_CLICK_EVENT));
    });
  }

  /**
   * @param {boolean} isLoading
   */
  set isLoading(isLoading) {
    this.#isLoading = isLoading;
    this.render();
  }

  /**
   * Adds listener on search button click event.
   *
   * @param {function(string)} listener
   */
  onClick(listener) {
    this.#eventTarget.addEventListener(BUTTON_CLICK_EVENT, () => {
      const inputValue = this.rootElement.querySelector(`[data-td="${INPUT}"]`).value;
      listener(inputValue);
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
  <div class="input-group search-line">
    <input ${this.markElement(INPUT)} class="form-control" id="search" name="Search" 
           placeholder="Enter entity name..." type="text"
           ${this.#isLoading ? 'disabled' : ''}>
    <span class="input-group-btn">
      <button ${this.markElement(BUTTON)} class="btn btn-primary" title="Search" type="button"
              ${this.#isLoading ? 'disabled' : ''}>
          ${this.#isLoading ? '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>' : ''}Search
      </button>
    </span>
  </div>`;
  }
}
