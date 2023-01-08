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
  #isLoading = false;
  #itemType;
  #itemName;
  #error;
  #cancelButton;
  #deleteButton;
  #isHidden = true;
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   * @param {string} itemName
   * @param {string} itemType
   * @param {string} error
   */
  constructor(parent, itemName, itemType, error) {
    super(parent);
    this.#itemName = itemName;
    this.#itemType = itemType;
    this.#error = error;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const deleteButtonSlot = this.getSlot(DELETE_BUTTON_SLOT);
    const deleteButton = new Button(deleteButtonSlot, {
      text: 'Delete',
      title: 'Delete',
      type: BUTTON_TYPE.DANGER,
      isDisabled: this.#isLoading});
    deleteButton.onClick(()=>{
      this.#eventTarget.dispatchEvent(new Event(DELETE_EVENT));
    });
    this.#deleteButton = deleteButton;

    const cancelButtonSlot = this.getSlot(CANCEL_BUTTON_SLOT);
    const cancelButton = new Button(cancelButtonSlot, {
      text: 'Cancel',
      title: 'Cancel',
      type: BUTTON_TYPE.DEFAULT,
      isDisabled: this.#isLoading});
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
   * @param {boolean} isLoading
   */
  set isLoading(isLoading) {
    this.#isLoading = isLoading;
    this.#deleteButton.isDisabled = isLoading;
    this.#cancelButton.isDisabled = isLoading;
    if (isLoading) {
      this.#deleteButton.text = '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span> Delete';
    } else {
      this.#deleteButton.text = `Delete`;
    }
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
  set itemName(value) {
    this.#itemName = value;
    this.render();
  }

  /**
   * @param {string} value
   */
  set itemType(value) {
    this.#itemType = value;
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
      <div ${this.markElement('modal-remove-component')} 
      style="${this.#isHidden ? 'display: none' : 'display: unset'}" class="modal">
          <div class="modal-container">
              <header>
                  <h3>Delete ${this.#itemType}</h3>
                  <a ${this.markElement(CLOSE_CROSS)} href="">×</a>
              </header>
              <div class="modal-body">
                  <p class="modal-text">
                      Are you sure you want to delete "${this.#itemName}"?
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
