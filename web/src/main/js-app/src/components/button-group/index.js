import {Component} from '../component';

const BUTTONS_SLOT = 'buttons-slot';

/**
 * ButtonGroup component.
 */
export class ButtonGroup extends Component {
  #buttonCreators = [];
  #error;

  /**
   * @param {HTMLElement} parent
   * @param {...function(HTMLElement): void} buttonCreators
   */
  constructor(parent, buttonCreators = []) {
    super(parent);
    this.#buttonCreators = buttonCreators;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const buttonsSlot = this.rootElement.querySelector(`[data-td="${BUTTONS_SLOT}"]`);
    if (buttonsSlot) {
      this.#buttonCreators.forEach((creator) => {
        creator(buttonsSlot);
      });
    }
  }

  /**
   * @param {...function(HTMLElement): void} buttonCreators
   */
  set buttonCreators(buttonCreators) {
    this.#buttonCreators = buttonCreators;
    this.render();
  }

  /**
   * @param {string} error
   */
  set error(error) {
    this.#error = error;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    const error = this.#error ? `<p class="help-block text-danger">${this.#error}</p>` : '';
    const loading = this.#buttonCreators.length === 0 ?
        '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>' :
        '';
    return `
            <div class="col-xs-4 col-sm-6 tool-bar-buttons">
                <div aria-label="..." class="btn-group" role="group" ${this.markElement(BUTTONS_SLOT)}>
                </div>
                ${loading}
                ${error}
            </div>
            `;
  }
}
