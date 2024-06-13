import {Component} from '../component';
import {Link} from '../link';
import {inject} from '../../registry';

const FOLDER_LINK = 'folder-link-';
const REMOVE_BUTTON = 'remove-button-';

/**
 * File list component.
 */
export class FileList extends Component {
  #hasError;
  #folders;
  #files;
  #isLoading;
  @inject fileTypeIconFactory;

  /**
   * @typedef Folder
   * @param {string} name
   * @param {function(void): void} linkListener
   * @param {function(void): void} deleteListener
   */

  /**
   * @typedef File
   * @param {string} name
   * @param {string} type
   * @param {string} size
   * @param {function(void): void} deleteListener
   */

  /**
   * @param {HTMLElement} parent
   * @param {boolean} isLoading
   * @param {boolean} hasError
   * @param {Folder[]} folders
   * @param {File[]} files
   */
  constructor(parent, isLoading, hasError, folders, files) {
    super(parent);

    this.#isLoading = isLoading;
    this.#hasError = hasError;
    this.#folders = folders;
    this.#files = files;

    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.#folders.forEach((folder, index) => {
      const linkSlot = this.rootElement.querySelector(`[data-td="${FOLDER_LINK + index}"]`);
      if (linkSlot) {
        const link = new Link(linkSlot, folder.name);
        link.onClick(folder.linkListener);
      }
    });

    [...this.#folders, ...this.#files].forEach((item, index) => {
      this.rootElement.querySelector(`[data-td="${REMOVE_BUTTON+index}"]`)
          ?.addEventListener('click', item.deleteListener);
    });
  }

  /**
   * @param {boolean} value
   */
  set isLoading(value) {
    this.#isLoading = value;
    this.render();
  }

  /**
   * @param {boolean} value
   */
  set hasError(value) {
    this.#hasError = value;
    this.render();
  }

  /**
   * Set folder content.
   *
   * @param {Folder[]} folders
   * @param {File[]} files
   */
  setContent(folders, files) {
    this.#folders = folders;
    this.#files = files;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    if (this.#isLoading) {
      return `<div ${this.markElement('folder-content-loading')} class="table-wrapper">
                        <p class="centered-in-table">
                            <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
                        </p>
                    </div>`;
    }

    if (this.#hasError) {
      return `<div ${this.markElement('folder-content-error')} class="table-wrapper">
                        <p class="centered-in-table text-danger">
                            <span class="glyphicon glyphicon-exclamation-sign"></span>
                            Can't load directory data
                        </p>
                    </div>`;
    }
    if (this.#folders.length === 0 && this.#files.length === 0) {
      return `<div ${this.markElement('folder-content-empty')} class="table-wrapper">
                        <p class="centered-in-table">
                            There are no files/directories created yet.
                        </p>
                    </div>`;
    }

    let folderContent = '';
    this.#folders.forEach((folder, index) => {
      folderContent +=
                `
                <tr>
                    <td class="cell-arrow">
                        <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
                    </td>
                    <td class="cell-icon">
                        <span aria-hidden="true" class="glyphicon ${this.fileTypeIconFactory.getIcon('folder')}">
                        </span>
                    </td>
                    <td class="cell-name">${this.addSlot(FOLDER_LINK + index)}</td>
                    <td class="cell-type">Folder</td>
                    <td class="cell-size">—</td>
                    <td class="cell-buttons">
                        <div class="data-buttons-container">
                            <button class="icon-button"
                                    title="Upload file.">
                                <span aria-hidden="true" class="glyphicon glyphicon-upload"></span>
                            </button>
                            <button ${this.markElement(REMOVE_BUTTON + index)} class="icon-button" title="Delete">
                                <span aria-hidden="true"
                                      class="glyphicon glyphicon-remove-circle"></span>
                            </button>
                        </div>
                    </td>
                </tr>
                `;
    });
    this.#files.forEach((file, index) => {
      folderContent +=
                `
                <tr>
                    <td class="cell-arrow"></td>
                    <td class="cell-icon">
                        <span aria-hidden="true" class="glyphicon ${this.fileTypeIconFactory.getIcon(file.type)}">
                        </span>
                    </td>
                    <td class="cell-name">${file.name}</td>
                    <td class="cell-type">${file.type}</td>
                    <td class="cell-size">${file.size}</td>
                    <td class="cell-buttons">
                        <div class="data-buttons-container">
                            <button class="icon-button"
                                    title="Download file.">
                                <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
                            </button>
                            <button ${this.markElement(REMOVE_BUTTON +(this.#folders.length + index))}
                             class="icon-button" title="Delete">
                                <span aria-hidden="true"
                                      class="glyphicon glyphicon-remove-circle"></span>
                            </button>
                        </div>
                    </td>
                </tr>
                `;
    });
    return `
        <div class="table-wrapper">
            <table class="table table-hover">
                ${folderContent}
            </table>
        </div>
        `;
  }
}
