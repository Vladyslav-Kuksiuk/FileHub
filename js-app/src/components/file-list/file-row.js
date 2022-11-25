import {Component} from '../component';
import {inject} from '../../registry';

const REMOVE_CLICK_EVENT = 'REMOVE_CLICK_EVENT';
const DOWNLOAD_CLICK_EVENT = 'DOWNLOAD_CLICK_EVENT';
const REMOVE_BUTTON = 'remove-button';
const DOWNLOAD_BUTTON = 'download-button';

/**
 * FileRow component.
 */
export class FileRow extends Component {
  #name;
  #type;
  #size;
  #eventTarget = new EventTarget();
  @inject #fileTypeIconFactory;

  /**
   * @param {HTMLElement} parent
   * @param {string} name
   * @param {string} type
   * @param {string} size
   */
  constructor(parent, name, type, size) {
    super(parent);
    this.#name = name;
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
   * @inheritDoc
   */
  markup() {
    return `
    <tr>
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon ${this.#fileTypeIconFactory.getIcon(this.#type)}"></span>
       </td>
       <td class="cell-name">${this.#name}</td>
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
