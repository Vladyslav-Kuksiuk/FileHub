import {Component} from '../component';
import {inject} from '../../registry';

const FILE_LIST_TABLE= 'file-list-table';

/**
 * File list component.
 */
export class FileList extends Component {
  #hasError;
  #folderCreators = [];
  #fileCreators = [];
  #isLoading;
  @inject #fileTypeIconFactory;

  /**
   * @param {HTMLElement} parent
   * @param {boolean} isLoading
   * @param {boolean} hasError
   */
  constructor(parent, isLoading, hasError) {
    super(parent);

    this.#isLoading = isLoading;
    this.#hasError = hasError;

    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const folderContentSlot = this.rootElement.querySelector(`[data-td="${FILE_LIST_TABLE}"]`);
    if (folderContentSlot) {
      this.#folderCreators.forEach((folderCreator) => {
        folderCreator(folderContentSlot);
      });
      this.#fileCreators.forEach((fileCreator) => {
        fileCreator(folderContentSlot);
      });
    }
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
   * @param {function({HTMLElement}): void} folderCreators
   * @param {function({HTMLElement}): void} fileCreators
   */
  setContent(folderCreators, fileCreators) {
    this.#folderCreators = folderCreators;
    this.#fileCreators = fileCreators;
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
    if (this.#folderCreators.length === 0 && this.#fileCreators.length === 0) {
      return `<div ${this.markElement('folder-content-empty')} class="table-wrapper">
                        <p class="centered-in-table">
                            There are no files/directories created yet.
                        </p>
                    </div>`;
    }
    return `
        <div class="table-wrapper">
            <table class="table table-hover">
            <tbody ${this.markElement(FILE_LIST_TABLE)}></tbody>
            </table>
        </div>
        `;
  }
}
