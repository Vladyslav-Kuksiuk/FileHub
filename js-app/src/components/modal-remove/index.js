import {Component} from '../component';
import {Button, BUTTON_TYPE} from '../button';

const DELETE_EVENT = 'DELETE_EVENT';
const CANCEL_EVENT = 'CANCEL_EVENT';
const DELETE_BUTTON_SLOT = 'delete-button-slot';
const CANCEL_BUTTON_SLOT = 'cancel-button-slot';
const CLOSE_CROSS = 'close-cross';

/**
 * ModalRemove component.
 */
export class ModalRemove extends Component {
  #fileName;
  #error;
  #cancelButton;
  #deleteButton;
  #isHidden = true;
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   * @param {string} fileName
   * @param {string} error
   */
  constructor(parent, fileName, error) {
    super(parent);
    this.#fileName = fileName;
    this.#error = error;
    this.init();
  }

  /**
   * @param {boolean} isLoading
   */
  set isLoading(isLoading) {
    this.#deleteButton.disabled = isLoading;
    this.#cancelButton.disabled = isLoading;
    if (isLoading) {
      this.#deleteButton.title = '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span> Delete';
    } else {
      this.#deleteButton.title = `Delete`;
    }
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const deleteButtonSlot = this.getSlot(DELETE_BUTTON_SLOT);
    const deleteButton = new Button(deleteButtonSlot, 'Delete', BUTTON_TYPE.DANGER);
    deleteButton.onClick(()=>{
      this.#eventTarget.dispatchEvent(new Event(DELETE_EVENT));
    });
    this.#deleteButton = deleteButton;

    const cancelButtonSlot = this.getSlot(CANCEL_BUTTON_SLOT);
    const cancelButton = new Button(cancelButtonSlot, 'Cancel');
    cancelButton.onClick(()=>{
      this.#eventTarget.dispatchEvent(new Event(CANCEL_EVENT));
    });
    this.#cancelButton = cancelButton;

    this.rootElement.querySelector(`[data-td="${CLOSE_CROSS}"]`)
        .addEventListener('click', (event)=>{
          event.preventDefault();
          this.#eventTarget.dispatchEvent(new Event(CANCEL_EVENT));
        });
  }

  /**
   * @param {boolean} isHidden
   */
  set isHidden(isHidden) {
    this.#isHidden = isHidden;
    this.render();
  }

  /**
   * @param {string} value
   */
  set fileName(value) {
    this.#fileName = value;
    this.render();
  }

  /**
   * @param {string} value
   */
  set error(value) {
    this.#error = value;
    this.render();
  }

  /**
   * Adds listener on cancel event.
   *
   * @param {Function} listener
   */
  onCancel(listener) {
    this.#eventTarget.addEventListener(CANCEL_EVENT, listener);
  }

  /**
   * Adds listener on delete event.
   *
   * @param {Function} listener
   */
  onDelete(listener) {
    this.#eventTarget.addEventListener(DELETE_EVENT, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
      <div ${this.#isHidden ? 'hidden' : ''} class="modal">
          <div class="modal-container">
              <header>
                  <h3>Delete File</h3>
                  <a ${this.markElement(CLOSE_CROSS)} href="">×</a>
              </header>
              <div class="modal-body">
                  <p class="modal-text">
                      Are you sure you want to delete "${this.#fileName}" file?
                  </p>
                  ${this.#error ? '<p class="help-block text-danger">'+this.#error+'</p>' : ''}
              </div>
              <footer>
                  <ul class="modal-buttons">
                      <li>
                          ${this.addSlot(CANCEL_BUTTON_SLOT)}
                      </li>
                      <li>
                          ${this.addSlot(DELETE_BUTTON_SLOT)}
                      </li>
                  </ul>
              </footer>
          </div>
      </div>
    `;
  }
}
