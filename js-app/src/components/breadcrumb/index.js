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

  /**
   *@typedef Folder
   * @param {string} name
   * @param {Function} linkListener
   */

  /**
   * @param {HTMLElement} parent
   * @param {boolean} isLoading
   * @param {boolean} hasError
   * @param {Folder[]} path
   */
  constructor(parent, isLoading, hasError, path) {
    super(parent);

    this.#isLoading = isLoading;
    this.#hasError = hasError;
    this.#path = path;

    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.#path.forEach((folder, index)=>{
      if (index < this.#path.length - 1) {
        const linkSlot = this.getSlot(LINK_SLOT+index);
        if (linkSlot) {
          const link = new Link(linkSlot, folder.name);
          link.onClick(folder.linkListener);
        }
      }
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
