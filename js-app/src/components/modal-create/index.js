import {Component} from '../component';
import {Button, BUTTON_TYPE} from '../button';

const CREATE_EVENT = 'CREATE_EVENT';
const CANCEL_EVENT = 'CANCEL_EVENT';
const CREATE_BUTTON_SLOT = 'create-button-slot';
const CANCEL_BUTTON_SLOT = 'cancel-button-slot';
const NAME_INPUT = 'name-input';
const CLOSE_CROSS = 'close-cross';

/**
 * ModalCreate component.
 */
export class ModalCreate extends Component {
  #isLoading = false;
  #error;
  #cancelButton;
  #createButton;
  #isHidden = true;
  #eventTarget = new EventTarget();

  #inputValue = '';

  /**
   * @param {HTMLElement} parent
   * @param {string} error
   */
  constructor(parent, error) {
    super(parent);
    this.#error = error;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const createButtonSlot = this.getSlot(CREATE_BUTTON_SLOT);
    const createButton = new Button(createButtonSlot, {
      text: this.#isLoading ? '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span> Create' : 'Create',
      title: 'Create',
      type: BUTTON_TYPE.PRIMARY,
      isDisabled: this.#isLoading});
    createButton.onClick(()=>{
      const name = this.rootElement.querySelector(`[data-td="${NAME_INPUT}"]`).value.trim();
      if (name) {
        this.#error = null;
        this.#inputValue = name;
        this.#eventTarget.dispatchEvent(new CustomEvent(CREATE_EVENT, {
          detail: {
            name: name,
          },
        }));
      } else {
        this.#error = 'Directory name can`t be empty';
        this.render();
      }
    });
    this.#createButton = createButton;

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
    this.#createButton.isDisabled = isLoading;
    this.#cancelButton.isDisabled = isLoading;
    if (isLoading) {
      this.#createButton.text = '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span> Create';
    } else {
      this.#createButton.text = `Create`;
    }
    this.render();
  }

  /**
   * @param {boolean} isHidden
   */
  set isHidden(isHidden) {
    this.#isHidden = isHidden;
    this.#inputValue = '';
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
   * Adds listener on create event.
   *
   * @param {function(string): void} listener
   */
  onCreate(listener) {
    this.#eventTarget.addEventListener(CREATE_EVENT, (event) => {
      listener(event.detail.name);
    });
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
      <div ${this.markElement('modal-create-component')} 
      style="${this.#isHidden ? 'display: none' : 'display: unset'}" class="modal">
          <div class="modal-container">
              <header>
                  <h3>Create New Directory</h3>
                  <a ${this.markElement(CLOSE_CROSS)} href="">×</a>
              </header>
              <div class="modal-body">
                <div class="form-row-input">
                    <input class="form-control ${this.#error ? 'input-error' : ''}" id="directory-name-input"
                       name="directory-name"
                       value="${this.#inputValue}"
                       placeholder="Enter directory name..."
                       type="text" ${this.markElement(NAME_INPUT)}
                       ${this.#isLoading ? 'disabled' : ''}>
                    ${this.#error ? '<p class="help-block text-danger">'+this.#error+'</p>' : ''}
            </div>
              </div>
              <footer>
                  <ul class="modal-buttons">
                      <li>
                          ${this.addSlot(CANCEL_BUTTON_SLOT)}
                      </li>
                      <li>
                          ${this.addSlot(CREATE_BUTTON_SLOT)}
                      </li>
                  </ul>
              </footer>
          </div>
      </div>
    `;
  }
}
