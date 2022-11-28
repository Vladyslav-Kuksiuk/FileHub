import {Component} from '../component';
import {inject} from '../../registry';
import {Link} from '../link';

const REMOVE_CLICK_EVENT = 'REMOVE_CLICK_EVENT';
const UPLOAD_CLICK_EVENT = 'UPLOAD_CLICK_EVENT';
const FOLDER_LINK_CLICK_EVENT = 'FOLDER_LINK_CLICK_EVENT';
const REMOVE_BUTTON = 'remove-button';
const UPLOAD_BUTTON = 'upload-button';
const FOLDER_LINK_SLOT = 'folder-link-slot';

/**
 * FolderRow component.
 */
export class FolderRow extends Component {
  #name;
  #eventTarget = new EventTarget();
  #isUploading = false;
  #uploadingError = false;
  @inject fileTypeIconFactory;

  /**
   * @param {HTMLElement} parent
   * @param {string} name
   */
  constructor(parent, name) {
    super(parent);
    this.#name = name;
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
    this.render();
  }

  /**
   * @param {string} uploadingError
   */
  set uploadingError(uploadingError) {
    this.#uploadingError = uploadingError;
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
      </button>
      `;
    }

    if (this.#uploadingError) {
      uploadingButton = `
        <button ${this.markElement(UPLOAD_BUTTON)} class="icon-button" title="${this.#uploadingError}">
            <span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>
        </button>`;
    }
    return `
    <tr>
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon ${this.fileTypeIconFactory.getIcon('folder')}"></span>
        </td>
        <td class="cell-name">${this.addSlot(FOLDER_LINK_SLOT)}</td>
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
