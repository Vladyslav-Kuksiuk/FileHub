import {Component} from "../../components/component.js";
import {Button, BUTTON_TYPE} from "../../components/button/index.js";

const SHARE_EVENT = 'SHARE_EVENT';
const STOP_SHARING_EVENT = 'STOP_SHARING_EVENT';
const CANCEL_EVENT = 'CANCEL_EVENT';
const SHARE_BUTTON_SLOT = 'share-button-slot';
const STOP_SHARING_BUTTON_SLOT = 'stop-sharing-button-slot';
const CANCEL_BUTTON_SLOT = 'cancel-button-slot';
const CLOSE_CROSS = 'close-cross';

/**
 * ModalShare component.
 */
export class ModalShare extends Component {
    #fileName
    #shareLink
    #isHidden = true;
    #eventTarget = new EventTarget();

    /**
     * @param {HTMLElement} parent
     * @param {boolean} isHidden
     * @param {string} fileName
     * @param {string} shareTag
     */
    constructor(parent,isHidden,  fileName, shareTag) {
        super(parent);
        this.#isHidden = isHidden;
        this.#fileName = fileName;
        this.#shareLink = shareTag ? "http://localhost:4567/shared-file/" + shareTag : null;
        this.init();
    }

    /**
     * @inheritDoc
     */
    afterRender() {
        if(this.#shareLink === null){
            const shareButtonSlot = this.getSlot(SHARE_BUTTON_SLOT);
            const shareButton = new Button(shareButtonSlot, {
                text: 'Share',
                title: 'Share',
                type: BUTTON_TYPE.SUCCESS});
            shareButton.onClick(()=>{
                this.#eventTarget.dispatchEvent(new Event(SHARE_EVENT));
            });
        } else {
            const unshareButtonSlot = this.getSlot(STOP_SHARING_BUTTON_SLOT);
            const unshareButton = new Button(unshareButtonSlot, {
                text: 'Stop Sharing',
                title: 'Stop Sharing',
                type: BUTTON_TYPE.DANGER});
            unshareButton.onClick(()=>{
                this.#eventTarget.dispatchEvent(new Event(STOP_SHARING_EVENT));
            });
        }

        const cancelButtonSlot = this.getSlot(CANCEL_BUTTON_SLOT);
        const cancelButton = new Button(cancelButtonSlot, {
            text: 'Cancel',
            title: 'Cancel',
            type: BUTTON_TYPE.DEFAULT});
        cancelButton.onClick(()=>{
            this.#eventTarget.dispatchEvent(new Event(CANCEL_EVENT));
        });

        this.rootElement.querySelector(`[data-td="${CLOSE_CROSS}"]`)
            .addEventListener('click', (event)=>{
                event.preventDefault();
                this.#eventTarget.dispatchEvent(new Event(CANCEL_EVENT));
            });
    }

    /**
     * @param {boolean} isHidden
     * @param {string} fileName
     * @param {string} shareTag
     */
    reload(isHidden, fileName, shareTag) {
        this.#isHidden = isHidden;
        this.#fileName = fileName;
        this.#shareLink = shareTag ? "http://localhost:4567/#shared-file/" + shareTag : null;
        this.render();
    }

    /**
     * Adds listener on cancel event.
     *
     * @param {Function} listener
     */
    onCancel(listener) {
        this.#eventTarget.addEventListener(CANCEL_EVENT, () => {
            this.#isHidden = true;
            listener()
            this.render();
        });
    }

    /**
     * Adds listener on share event.
     *
     * @param {Function} listener
     */
    onShare(listener) {
        this.#eventTarget.addEventListener(SHARE_EVENT, listener);
    }

    /**
     * Adds listener on stop sharing event.
     *
     * @param {Function} listener
     */
    onStopSharing(listener) {
        this.#eventTarget.addEventListener(STOP_SHARING_EVENT, listener);
    }

    /**
     * @inheritDoc
     */
    markup() {
        let shareInfo = this.#shareLink === null ?
            `<p class="modal-text">File '${this.#fileName}' is not shared</p>` :
            `<p class="modal-text">File '${this.#fileName}' is shared by link: \n<span style='font-weight: bold'>${this.#shareLink}</span></p>`

        return `
      <div ${this.markElement('modal-share-component')} 
      style="${this.#isHidden ? 'display: none' : 'display: unset'}" class="modal">
          <div class="modal-container">
              <header>
                  <h3>Share File</h3>
                  <a ${this.markElement(CLOSE_CROSS)} href="">×</a>
              </header>
              <div class="modal-body">
                  ${shareInfo}
              </div>
              <footer>
                  <ul class="modal-buttons">
                      <li>
                          ${this.addSlot(CANCEL_BUTTON_SLOT)}
                      </li>
                      <li>
                          ${this.addSlot(SHARE_BUTTON_SLOT)}
                          ${this.addSlot(STOP_SHARING_BUTTON_SLOT)}
                      </li>
                  </ul>
              </footer>
          </div>
      </div>
    `;
    }
}
