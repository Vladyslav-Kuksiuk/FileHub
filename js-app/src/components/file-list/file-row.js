import {Component} from '../component';
import {inject} from '../../registry';

const REMOVE_CLICK_EVENT = 'REMOVE_CLICK_EVENT';
const DOWNLOAD_CLICK_EVENT = 'DOWNLOAD_CLICK_EVENT';
const OPEN_RENAME_FORM_EVENT = 'OPEN_RENAME_FORM_EVENT';
const RENAME_EVENT = 'RENAME_EVENT';
const REMOVE_BUTTON = 'remove-button';
const DOWNLOAD_BUTTON = 'download-button';
const NAME_CELL = 'name-cell';
const RENAME_FORM = 'rename-form';

/**
 * FileRow component.
 */
export class FileRow extends Component {
  #name;
  #temporaryName;
  #type;
  #size;
  #isRenameFormOpen;

  #isRenaming;

  #renamingErrors = [];
  #eventTarget = new EventTarget();
  @inject fileTypeIconFactory;

  /**
   * @param {HTMLElement} parent
   * @param {string} name
   * @param {string} type
   * @param {string} size
   */
  constructor(parent, name, type, size) {
    super(parent);
    this.#name = name;
    this.#temporaryName = name;
    this.#type = type;
    this.#size = size;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.querySelector(`[data-td="${DOWNLOAD_BUTTON}"]`)?.addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(DOWNLOAD_CLICK_EVENT));
    });

    this.rootElement.querySelector(`[data-td="${REMOVE_BUTTON}"]`)?.addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(REMOVE_CLICK_EVENT));
    });

    this.rootElement.querySelector(`[data-td="${NAME_CELL}"]`)?.addEventListener('dblclick', ()=>{
      if (!this.#isRenameFormOpen) {
        this.#eventTarget.dispatchEvent(new Event(OPEN_RENAME_FORM_EVENT));
      }
    });

    const renameForm = this.rootElement.querySelector(`[data-td="${RENAME_FORM}"]`);
    renameForm?.addEventListener('submit', (event)=>{
      event.preventDefault();
      this.#temporaryName = new FormData(event.target).get('renameField');
      this.#eventTarget.dispatchEvent(new Event(RENAME_EVENT));
    });
    renameForm?.querySelector('input').focus();
  }

  /**
   * Adds listener on download button click event.
   *
   * @param {function(): void} listener
   */
  onDownload(listener) {
    this.#eventTarget.addEventListener(DOWNLOAD_CLICK_EVENT, listener);
  }

  /**
   * Adds listener on remove button click event.
   *
   * @param {function(): void} listener
   */
  onRemove(listener) {
    this.#eventTarget.addEventListener(REMOVE_CLICK_EVENT, listener);
  }

  /**
   * Adds listener on name cell doubleclick event.
   *
   * @param {function(): void} listener
   */
  onRenameFormOpen(listener) {
    this.#eventTarget.addEventListener(OPEN_RENAME_FORM_EVENT, listener);
  }

  /**
   * Adds listener on rename event.
   *
   * @param {function(string): void} listener
   */
  onRename(listener) {
    this.#eventTarget.addEventListener(RENAME_EVENT, ()=>{
      listener(this.#temporaryName);
    });
  }

  /**
   * @param {boolean} isRenameFormOpen
   */
  set isRenameFormOpen(isRenameFormOpen) {
    if (this.#isRenameFormOpen === isRenameFormOpen) {
      return;
    }

    this.#isRenameFormOpen = isRenameFormOpen;
    if (!isRenameFormOpen) {
      this.#temporaryName = this.#name;
    }
    this.render();
  }

  /**
   * @param {boolean} isRenaming
   */
  set isRenaming(isRenaming) {
    this.#isRenaming = isRenaming;
    this.render();
  }

  /**
   * @param {string[]} errors
   */
  set renamingErrors(errors) {
    this.#renamingErrors = errors;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    let nameCellContent = this.#name;
    let errors = '';

    this.#renamingErrors.forEach((error) => {
      errors += `<p class="help-block text-danger">${error}</p>`;
    });

    if (this.#isRenameFormOpen) {
      nameCellContent = `
      <form ${this.markElement(RENAME_FORM)} class="name-edit-form">
          <input class="form-control ${errors.length>0 ? 'input-error' : '' }" name="renameField"
          placeholder="Enter file name..." type="text" value="${this.#temporaryName}">
          ${errors}
      </form> `;
    }

    if (this.#isRenaming) {
      nameCellContent = `
      <form class="name-edit-form">
          <input class="form-control" disabled placeholder="Enter file name..."
                 type="text" value="${this.#temporaryName}">
          <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </form>
      `;
    }

    return `
    <tr>
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon ${this.fileTypeIconFactory.getIcon(this.#type)}"></span>
       </td>
       <td class="cell-name" ${this.markElement(NAME_CELL)} >${nameCellContent}</td>
       <td class="cell-type">${this.#type}</td>
       <td class="cell-size">${this.#size}</td>
       <td class="cell-buttons">
           <div class="data-buttons-container">
               <button ${this.markElement(DOWNLOAD_BUTTON)} class="icon-button" title="Download file.">
                   <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
               </button>
               <button ${this.markElement(REMOVE_BUTTON)} class="icon-button" title="Delete">
                   <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
               </button>
           </div>
       </td>
    </tr>
    `;
  }
}
