import {Component} from '../component';
import {inject} from '../../registry';
import {Link} from '../link';

const REMOVE_CLICK_EVENT = 'REMOVE_CLICK_EVENT';
const UPLOAD_CLICK_EVENT = 'UPLOAD_CLICK_EVENT';
const FOLDER_LINK_CLICK_EVENT = 'FOLDER_LINK_CLICK_EVENT';
const OPEN_RENAME_FORM_EVENT = 'OPEN_RENAME_FORM_EVENT';
const RENAME_EVENT = 'RENAME_EVENT';
const REMOVE_BUTTON = 'remove-button';
const UPLOAD_BUTTON = 'upload-button';
const FOLDER_LINK_SLOT = 'folder-link-slot';
const NAME_CELL = 'name-cell';
const RENAME_INPUT = 'rename-input';

/**
 * FolderRow component.
 */
export class FolderRow extends Component {
  #name;
  #temporaryName;
  #eventTarget = new EventTarget();
  #isUploading = false;
  #uploadingError = false;
  #isRenameFormOpen = false;
  #isRenaming = false;
  #renamingErrors = [];
  @inject fileTypeIconFactory;
  #blurListener;
  #renameInput;

  /**
   * @param {HTMLElement} parent
   * @param {string} name
   * @param {string} temporaryName
   */
  constructor(parent, name, temporaryName = name) {
    super(parent);
    this.#name = name;
    this.#temporaryName = temporaryName;
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.rootElement.querySelector(`[data-td="${UPLOAD_BUTTON}"]`)?.addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(UPLOAD_CLICK_EVENT));
    });

    this.rootElement.querySelector(`[data-td="${REMOVE_BUTTON}"]`)?.addEventListener('click', (event)=>{
      event.preventDefault();
      this.#eventTarget.dispatchEvent(new Event(REMOVE_CLICK_EVENT));
    });

    const folderLinkSlot = this.getSlot(FOLDER_LINK_SLOT);
    if (folderLinkSlot) {
      const link = new Link(folderLinkSlot, this.#name);
      link.onClick(()=>{
        this.#eventTarget.dispatchEvent(new Event(FOLDER_LINK_CLICK_EVENT));
      });
    }

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
   * Adds listener on folder link click event.
   *
   * @param {function(): void} listener
   */
  onFolderLinkClick(listener) {
    this.#eventTarget.addEventListener(FOLDER_LINK_CLICK_EVENT, listener);
  }

  /**
   * Adds listener on upload button click event.
   *
   * @param {function(): void} listener
   */
  onUpload(listener) {
    this.#eventTarget.addEventListener(UPLOAD_CLICK_EVENT, listener);
  }

  /**
   * @param {boolean} isUploading
   */
  set isUploading(isUploading) {
    this.#isUploading = isUploading;
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
  }

  /**
   * @param {string} uploadingError
   */
  set uploadingError(uploadingError) {
    this.#uploadingError = uploadingError;
    this.#renameInput?.removeEventListener('blur', this.#blurListener);
    this.render();
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
   * @inheritDoc
   */
  markup() {
    let uploadingButton = `
        <button ${this.markElement(UPLOAD_BUTTON)} class="icon-button" title="Upload file.">
            <span aria-hidden="true" class="glyphicon glyphicon-upload"></span>
        </button>`;
    if (this.#isUploading) {
      uploadingButton = `
      <button ${this.markElement(UPLOAD_BUTTON)} disabled class="icon-button" title="File uploading...">
         <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </button>`;
    }

    let nameCellContent = this.addSlot(FOLDER_LINK_SLOT);
    let renameErrors = '';

    this.#renamingErrors.forEach((error) => {
      renameErrors += `<p class="help-block text-danger">${error}</p>`;
    });

    if (this.#isRenameFormOpen) {
      nameCellContent = `
      <form class="name-edit-form">
          <input class="form-control ${renameErrors.length>0 ? 'input-error' : '' }" name="renameField"
          placeholder="Enter file name..." type="text" value="${this.#temporaryName}"
          ${this.markElement(RENAME_INPUT)}>
          ${renameErrors}
      </form> `;
    }

    if (this.#isRenaming) {
      nameCellContent = `
      <form class="name-edit-form">
          <input class="form-control" disabled placeholder="Enter file name..."
                 type="text" value="${this.#temporaryName}">
          <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </form>`;
    }

    if (this.#uploadingError) {
      uploadingButton = `
        <button ${this.markElement(UPLOAD_BUTTON)} class="icon-button" title="${this.#uploadingError}">
            <span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>
        </button>`;
    }
    return `
    <tr class="folder-row">
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon ${this.fileTypeIconFactory.getIcon('folder')}"></span>
        </td>
        <td class="cell-name" ${this.markElement(NAME_CELL)}>${nameCellContent}</td>
        <td class="cell-type">Folder</td>
        <td class="cell-size">—</td>
        <td class="cell-buttons">
            <div class="data-buttons-container">
                ${uploadingButton}
                <button ${this.markElement(REMOVE_BUTTON)} class="icon-button" title="Delete">
                    <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
                </button>
            </div>
        </td>
    </tr>
    `;
  }
}
