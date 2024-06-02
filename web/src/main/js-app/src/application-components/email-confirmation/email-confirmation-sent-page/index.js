import {Component} from "../../../components/component.js";
import {Link} from "../../../components/link";
import {inject} from "../../../registry.js";
import {EMAIL_ADDRESS} from "../../../storage-service.js";

/**
 * Email confirmation sent page component.
 */
export class EmailConfirmationSentPage extends Component {
    #isSentDelay = false
    @inject titleService;
    @inject apiService;
    @inject storageService;

    /**
     * @param {HTMLElement} parent
     */
    constructor(parent) {
        super(parent);
        this.titleService.setTitles(['Email confirmation']);
        this.init();
    }

    /**
     * @inheritDoc
     */
    afterRender() {
        if(!this.#isSentDelay){
            const retryLinkSlot = this.getSlot('retry-link');
            const retryLink = new Link(retryLinkSlot, "Send new email");
            retryLink.onClick(() => {
                this.apiService.sendConfirmationEmail(this.storageService.get(EMAIL_ADDRESS))
                    .then(()=>{
                        this.turnSendDelay();
                    })
            })
        }
    }

    turnSendDelay(){
        this.#isSentDelay = true;
        this.render()
        new Promise((resolve) => setTimeout(resolve, 10000))
            .then(()=>{
                this.#isSentDelay = false
                this.render()
            })
    }

    /**
     * @inheritDoc
     */
    markup() {
        const emailAddress = this.storageService.get(EMAIL_ADDRESS)
        const retryEmail = this.#isSentDelay ? "<p>New email sent</p>" : this.addSlot('retry-link')

        return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Email Confirmation</h1>
        <hr class="horizontal-line">
        <p>Your registration completed, but you need to confirm your email address.</p> 
        <p>Confirmation email sent to the \`${emailAddress}\` email address.</p>
        <p>You can close this tab after confirmation.</p>
        <br>
        ${retryEmail}
    </main>
</div>
    `;
    }
}
