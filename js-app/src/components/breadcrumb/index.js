import {Component} from '../component';
import {Link} from '../link';

const HOME_FOLDER_LINK_SLOT = 'home-folder-link-slot';
const PARENT_FOLDER_LINK_SLOT = 'parent-folder-link-slot';

/**
 * Breadcrumb component.
 */
export class Breadcrumb extends Component {
  #isLoading;
  #hasError;
  #isFirstNesting;
  #isSecondNesting;
  #folderName;

  /**
   * @param {HTMLElement} parent
   * @param {boolean} isLoading
   * @param {boolean} hasError
   * @param {boolean} isFirstNesting
   * @param {boolean} isSecondNesting
   * @param {string} folderName
   */
  constructor(parent, isLoading, hasError, isFirstNesting, isSecondNesting, folderName) {
    super(parent);

    this.#isLoading = isLoading;
    this.#hasError = hasError;
    this.#isFirstNesting = isFirstNesting;
    this.#isSecondNesting = isSecondNesting;
    this.#folderName = folderName;

    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    if (this.#isFirstNesting || this.#isSecondNesting) {
      const homeFolderLinkSlot = this.getSlot(HOME_FOLDER_LINK_SLOT);
      new Link(homeFolderLinkSlot, 'Home');
    }

    if (this.#isSecondNesting) {
      const parentFolderLinkSlot = this.getSlot(PARENT_FOLDER_LINK_SLOT);
      new Link(parentFolderLinkSlot, '...');
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
   * @param {boolean} value
   */
  set isFirstNesting(value) {
    this.#isFirstNesting = value;
    this.render();
  }

  /**
   * @param {boolean} value
   */
  set isSecondNesting(value) {
    this.#isSecondNesting = value;
    this.render();
  }

  /**
   * @param {string} value
   */
  set folderName(value) {
    this.#folderName = value;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    let breadcrumbData = '<li>Home</li>';

    if (this.#isLoading) {
      breadcrumbData = `<span ${this.markElement('breadcrumb-loading')}
                     aria-hidden="true" class="glyphicon glyphicon-repeat"></span>`;
    }

    if (this.#hasError) {
      breadcrumbData = `<span ${this.markElement('breadcrumb-error')} class="text-danger"> 
                           <span class="glyphicon glyphicon-exclamation-sign"></span>
                           Can't load breadcrumb data
                        </span>`;
    }

    if (this.#isFirstNesting) {
      breadcrumbData = `<li>${this.addSlot(HOME_FOLDER_LINK_SLOT)}</li>
                        <li>${this.#folderName}</li>`;
    }

    if (this.#isSecondNesting) {
      breadcrumbData = `<li>${this.addSlot(HOME_FOLDER_LINK_SLOT)}</li>
                        <li>${this.addSlot(PARENT_FOLDER_LINK_SLOT)}</li>
                        <li>${this.#folderName}</li>`;
    }

    return `<ul ${this.markElement('breadcrumb-component')} class="breadcrumb">${breadcrumbData}</ul>`;
  }
}
