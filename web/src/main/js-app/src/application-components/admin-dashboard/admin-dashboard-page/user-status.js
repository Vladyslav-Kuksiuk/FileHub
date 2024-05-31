import {Component} from "../../../components/component.js";
import {Button, BUTTON_TYPE} from "../../../components/button/index.js";

const BAN_CLICK_EVENT = 'BAN_CLICK_EVENT';
const UNBAN_CLICK_EVENT = 'UNBAN_CLICK_EVENT';
const DELETE_FILES_CLICK_EVENT = 'DELETE_FILES_CLICK_EVENT';
const BAN_BUTTON_SLOT = 'BAN_BUTTON_SLOT';
const UNBAN_BUTTON_SLOT = 'UNBAN_BUTTON_SLOT';
const DELETE_FILES_BUTTON_SLOT = 'DELETE_FILES_CLICK_EVENT';

/**
 * User status component.
 */
export class UserStatus extends Component {
    #eventTarget = new EventTarget();
    #email = null
    #isBanned = false
    #isShown = false

    /**
     * @param {HTMLElement} parent
     * @param {string} text
     */
    constructor(parent,isShown, email, isBanned) {
        super(parent);
        this.#isShown = isShown;
        this.#email = email;
        this.#isBanned = isBanned;
        this.init();
    }

    reload(isShown, email, isBanned) {
        this.#isShown = isShown
        this.#isBanned = isBanned
        this.#email = email
        this.render()
    }

    /**
     * @inheritDoc
     */
    afterRender() {
        if(!this.#isShown) {
            return
        }
        let banButtonSlot = this.getSlot(BAN_BUTTON_SLOT)
        let unbanButtonSlot = this.getSlot(UNBAN_BUTTON_SLOT)
        let deleteFilesButtonSlot = this.getSlot(DELETE_FILES_BUTTON_SLOT)

        if (!this.#isBanned) {
            let banButton = new Button(banButtonSlot, {
                text: "Ban",
                title: "Ban",
                type: BUTTON_TYPE.DANGER
            })
            banButton.onClick(()=>{
                this.#eventTarget.dispatchEvent(new Event(BAN_CLICK_EVENT));
            })
        } else {
            let unbanButton = new Button(unbanButtonSlot, {
                text: "Unban",
                title: "Unban",
                type: BUTTON_TYPE.SUCCESS
            })
            unbanButton.onClick(()=>{
                this.#eventTarget.dispatchEvent(new Event(UNBAN_CLICK_EVENT));
            })
        }
        let deleteFilesButton = new Button(deleteFilesButtonSlot, {
            text: "Delete files",
            title: "Delete files",
            type: BUTTON_TYPE.DANGER
        })
        deleteFilesButton.onClick(()=>{
            this.#eventTarget.dispatchEvent(new Event(DELETE_FILES_CLICK_EVENT));
        })
    }

    /**
     * Adds listener on ban button click event.
     *
     * @param {Function} listener
     */
    onBanClick(listener) {
        this.#eventTarget.addEventListener(BAN_CLICK_EVENT, () => {listener(this.#email)});
    }

    /**
     * Adds listener on unban button click event.
     *
     * @param {Function} listener
     */
    onUnbanClick(listener) {
        this.#eventTarget.addEventListener(UNBAN_CLICK_EVENT, () => {listener(this.#email)});
    }

    /**
     * Adds listener on delete files button click event.
     *
     * @param {Function} listener
     */
    onDeleteFilesClick(listener) {
        this.#eventTarget.addEventListener(DELETE_FILES_CLICK_EVENT, () => {listener(this.#email)});
    }

    /**
     * @inheritDoc
     */
    markup() {
        if (!this.#isShown) {
            return `<div></div>`
        }
        return `
<div>
    <h3>Status: ${this.#isBanned ? "<span style='color: #a81c12;'>Banned</span>" : "<span style='color: #26b926;'>Active</span>"}</h3>
    ${this.addSlot(BAN_BUTTON_SLOT)}
    ${this.addSlot(UNBAN_BUTTON_SLOT)}
    ${this.addSlot(DELETE_FILES_BUTTON_SLOT)}
</div>
    `;
    }
}
