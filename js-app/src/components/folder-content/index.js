import {Component} from '../component';
import {StateManagementService} from '../../state-management/state-management-service';
import {FOLDER_CONTENT_ITEM, FOLDER_ITEMS, FOLDER_TYPE, STATE} from '../../state-management/state';
import {LoadFolderInfoAction} from '../../state-management/folder/load-folder-info-action';
import {Link} from '../link';

const FOLDER_LINK = 'folder-link-';

/**
 * User panel component.
 */
export class FolderContent extends Component {
  #stateManagementService;
  #error;
  #folders;
  #files;
  #isLoading;

  /**
   * @param {HTMLElement} parent
   * @param {StateManagementService} stateManagementService
   */
  constructor(parent, stateManagementService) {
    super(parent);

    this.#stateManagementService = stateManagementService;
    const state = stateManagementService.state;
    this.#error = state[STATE.FOLDER_CONTENT_ERROR];
    this.#setFolderContent(state[STATE.FOLDER_CONTENT]);
    this.#isLoading = state[STATE.IS_FOLDER_CONTENT_LOADING];

    this.#stateManagementService.addStateListener(STATE.FOLDER_CONTENT, (state) => {
      this.#setFolderContent(state[STATE.FOLDER_CONTENT]);
    });
    this.#stateManagementService.addStateListener(STATE.IS_FOLDER_CONTENT_LOADING, (state) => {
      this.#setIsLoading(state[STATE.IS_FOLDER_CONTENT_LOADING]);
    });
    this.#stateManagementService.addStateListener(STATE.FOLDER_CONTENT_ERROR, (state) => {
      this.#setError(state[STATE.FOLDER_CONTENT_ERROR]);
    });
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.#folders.forEach((folder, index) => {
      const linkSlot = this.rootElement.querySelector(`[data-td="${FOLDER_LINK + index}"]`);
      const link = new Link(linkSlot, folder[FOLDER_CONTENT_ITEM.NAME]);
      link.onClick(() => {
        this.#stateManagementService.dispatch(new LoadFolderInfoAction(folder[FOLDER_CONTENT_ITEM.ID]));
      });
    });
  }

  /**
   * @param {object} folderContent
   * @private
   */
  #setFolderContent(folderContent) {
    this.#folders = folderContent?.[FOLDER_ITEMS]
        ?.filter((item) => item[FOLDER_CONTENT_ITEM.TYPE] === FOLDER_TYPE) || [];
    this.#files = folderContent?.[FOLDER_ITEMS]
        ?.filter((item) => item[FOLDER_CONTENT_ITEM.TYPE] !== FOLDER_TYPE) || [];
    this.render();
  }

  /**
   * @param {string} error
   * @private
   */
  #setError(error) {
    this.#error = error;
    this.render();
  }

  /**
   * @param {boolean} isLoading
   * @private
   */
  #setIsLoading(isLoading) {
    this.#isLoading = isLoading;
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

    if (this.#error) {
      return `<div ${this.markElement('folder-content-error')} class="table-wrapper">
                        <p class="centered-in-table text-danger">
                            <span class="glyphicon glyphicon-exclamation-sign"></span>
                            Can't load directory data
                        </p>
                    </div>`;
    }

    if (this.#folders.length === 0 && this.#files === 0) {
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
                        <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
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
                            <button class="icon-button" title="Delete">
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
                        <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
                    </td>
                    <td class="cell-name">${file[FOLDER_CONTENT_ITEM.NAME]}</td>
                    <td class="cell-type">${file[FOLDER_CONTENT_ITEM.TYPE]}</td>
                    <td class="cell-size">${file[FOLDER_CONTENT_ITEM.SIZE]}</td>
                    <td class="cell-buttons">
                        <div class="data-buttons-container">
                            <button class="icon-button"
                                    title="Download file.">
                                <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
                            </button>
                            <button class="icon-button" title="Delete">
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
