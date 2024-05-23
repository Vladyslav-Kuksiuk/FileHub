import {Component} from '../component';
import {inject} from '../../registry';

const REMOVE_CLICK_EVENT = 'REMOVE_CLICK_EVENT';
const DOWNLOAD_CLICK_EVENT = 'DOWNLOAD_CLICK_EVENT';
const OPEN_RENAME_FORM_EVENT = 'OPEN_RENAME_FORM_EVENT';
const RENAME_EVENT = 'RENAME_EVENT';
const REMOVE_BUTTON = 'remove-button';
const DOWNLOAD_BUTTON = 'download-button';
const NAME_CELL = 'name-cell';
const RENAME_INPUT = 'rename-input';

/**
 * FileRow component.
 */
export class FileRow extends Component {
  @inject fileTypeFactory;
  #name;
  #temporaryName;
  #mimetype;
  #size;
  #archivedSize;
  #isRenameFormOpen = false;
  #isRenaming = false;
  #renamingErrors = [];
  #eventTarget = new EventTarget();
  #blurListener;
  #renameInput;
  #isDownloading = false;
  #downloadingError;

  /**
   * @param {HTMLElement} parent
   * @param {string} name
   * @param {string} mimetype
   * @param {number} size
   * @param {number} archivedSize
   * @param {string} temporaryName
   */
  constructor(parent, name, mimetype, size, archivedSize, temporaryName = name) {
    super(parent);
    this.#name = name;
    this.#mimetype = mimetype;
    this.#size = size;
    this.#archivedSize = archivedSize;
    this.#temporaryName = temporaryName;
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

    let isChaneEventDispatched = false;
    const renameInput = this.rootElement.querySelector(`[data-td="${RENAME_INPUT}"]`);
    this.#renameInput = renameInput;
    renameInput?.focus();
    renameInput?.addEventListener('change', (event)=>{
      event.preventDefault();
      isChaneEventDispatched = true;
      this.#temporaryName = renameInput.value;
      this.#eventTarget.dispatchEvent(new Event(RENAME_EVENT));
    });
    this.#blurListener = ()=>{
      if (!isChaneEventDispatched) {
        this.isRenameFormOpen = false;
      }
    };
    renameInput?.addEventListener('blur', this.#blurListener);
    renameInput?.parentElement?.addEventListener('submit', (event) => {
      event.preventDefault();
      renameInput.blur();
    });
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
    this.#isRenameFormOpen = isRenameFormOpen;
    if (!isRenameFormOpen) {
      this.#temporaryName = this.#name;
    }
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
  }

  /**
   * @param {boolean} isDownloading
   */
  set isDownloading(isDownloading) {
    this.#isDownloading = isDownloading;
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
  }

  /**
   * @param {string} downloadingError
   */
  set downloadingError(downloadingError) {
    this.#downloadingError = downloadingError;
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
  }

  /**
   * @param {boolean} isRenaming
   */
  set isRenaming(isRenaming) {
    this.#isRenaming = isRenaming;
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
  }

  /**
   * @param {string[]} errors
   */
  set renamingErrors(errors) {
    this.#renamingErrors = errors;
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
  }

  /**
   * @param {number} size
   * @returns {string}
   * @private
   */
  #convertSize(size) {
    let iteration = 0;
    while (size > 1024) {
      iteration++;
      size/=1024;
    }
    const prefixArray = ['B', 'KB', 'MB', 'GB', 'TB'];
    return size.toFixed(1) + ' ' + prefixArray[iteration];
  };

  /**
   * @inheritDoc
   */
  markup() {
    const type = this.fileTypeFactory.getType(this.#mimetype);
    const size = this.#convertSize(this.#size);
    const archivedSize = this.#convertSize(this.#archivedSize);
    let nameCellContent = this.#name;
    let errors = '';

    let downloadingButton = `
        <button ${this.markElement(DOWNLOAD_BUTTON)} class="icon-button" title="Download file.">
            <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
        </button>`;

    if (this.#isDownloading) {
      downloadingButton = `
      <button ${this.markElement(DOWNLOAD_BUTTON)} disabled class="icon-button" title="File downloading...">
         <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </button>`;
    }

    if (this.#downloadingError) {
      downloadingButton = `
        <button ${this.markElement(DOWNLOAD_BUTTON)} class="icon-button" title="${this.#downloadingError}">
            <span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>
        </button>`;
    }

    this.#renamingErrors.forEach((error) => {
      errors += `<p class="help-block text-danger">${error}</p>`;
    });

    if (this.#isRenameFormOpen) {
      nameCellContent = `
      <form class="name-edit-form">
          <input class="form-control ${errors.length>0 ? 'input-error' : '' }" name="renameField"
          placeholder="Enter file name..." type="text" value="${this.#temporaryName}"
          ${this.markElement(RENAME_INPUT)}>
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
    <tr class="file-row">
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon ${type?.icon}"></span>
       </td>
       <td class="cell-name" ${this.markElement(NAME_CELL)} >${nameCellContent}</td>
       <td class="cell-type">${type?.type}</td>
       <td class="cell-size">${size} (${archivedSize})</td>
       <td class="cell-buttons">
           <div class="data-buttons-container">
               ${downloadingButton}
               <button ${this.markElement(REMOVE_BUTTON)} class="icon-button" title="Delete">
                   <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
               </button>
           </div>
       </td>
    </tr>
    `;
  }
}
