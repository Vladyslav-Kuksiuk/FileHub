import {Component} from '../component';
import {Link} from '../link';

const LINK_SLOT = 'link-slot-';

/**
 * Breadcrumb component.
 */
export class Breadcrumb extends Component {
  #isLoading;
  #hasError;
  #path;
  #folderLinkListener;

  /**
   *@typedef Folder
   * @param {string} name
   * @param {string} id
   */

  /**
   * @param {HTMLElement} parent
   * @param {boolean} isLoading
   * @param {boolean} hasError
   * @param {Folder[]} path
   * @param {function(string): void} folderLinkListener
   */
  constructor(parent, isLoading, hasError, path, folderLinkListener) {
    super(parent);

    this.#isLoading = isLoading;
    this.#hasError = hasError;
    this.#path = path;
    this.#folderLinkListener = folderLinkListener;

    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    for (let i = 0; i < this.#path.length - 1; i++) {
      const linkSlot = this.getSlot(LINK_SLOT + i);
      const folder = this.#path[i];
      if (linkSlot) {
        const link = new Link(linkSlot, folder.name);
        link.onClick(this.#folderLinkListener(folder.id));
      }
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
   * @param {Folder[]} value
   */
  set path(value) {
    this.#path = value;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    let breadcrumbData = '';
    this.#path.forEach((folder, index)=>{
      if (index < this.#path.length - 1) {
        breadcrumbData += `<li>${this.addSlot(LINK_SLOT + index)}</li>`;
      } else {
        breadcrumbData += `<li>${folder.name}</li>`;
      }
    });

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

    return `<ul ${this.markElement('breadcrumb-component')} class="breadcrumb">${breadcrumbData}</ul>`;
  }
}
