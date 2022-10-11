import {Component} from '../component.js';
import {Button} from '../button';

const FORM_SUBMIT_EVENT = 'formSubmitEvent';

/**
 * Authorization page component.
 */
export class Form extends Component {
    _buttonText;
    _linkText;
    _inputCreators = [];
    _eventTarget = new EventTarget();

    /**
     * Adds form controls and button.
     */
    afterRender() {
        const buttonSlot = this.getSlot('button');
        const button = new Button(buttonSlot);
        button.title = this._buttonText;

        const these = this;
        this._inputCreators = this._inputCreators ?? [];
        this._inputCreators.forEach((creator) => {
            const slot = these.getSlot('inputs');
            creator(slot);
        })

        this.rootElement.addEventListener('submit', (event) =>{
            event.preventDefault()
            this._eventTarget.dispatchEvent(new Event(FORM_SUBMIT_EVENT));
        })

    }

    set buttonText(text) {
        this._buttonText = text;
        this.render();
    }

    set linkText(text) {
        this._linkText = text;
        this.render();
    }

    addInput(inputCreator) {
        this._inputCreators.push(inputCreator)
        this.render()
    }

    onSubmit(listener){
        this._eventTarget.addEventListener(FORM_SUBMIT_EVENT,(event)=>{
            const formData = new FormData(this.rootElement);
            listener(formData);
        })
    }

    /**
     * Returns button's HTML as string.
     *
     * @returns {string}
     */
    markup() {
        return `
        <form action="" class="form-horizontal form-page">
            ${this.addSlot('inputs')}
            <div class="form-group">
                <div class="col-sm-8 col-sm-offset-4 form-row-button">
                    ${this.addSlot('button')}
                    <a class="form-link" href="" title="${this._linkText}">${this._linkText}</a>
                </div>
            </div>
        </form>
    `;
    }
}
