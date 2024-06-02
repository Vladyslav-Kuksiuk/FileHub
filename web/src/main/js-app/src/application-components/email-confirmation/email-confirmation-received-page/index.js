import {Component} from "../../../components/component.js";
import {Link} from "../../../components/link";
import {inject} from "../../../registry.js";
const NAVIGATE_EVENT_LOGIN = 'NAVIGATE_EVENT_LOGIN';
const NAVIGATE_EVENT_REGISTRATION = 'NAVIGATE_EVENT_REGISTRATION';
/**
 * Email confirmation received page component.
 */
export class EmailConfirmationReceivedPage extends Component {
    #eventTarget = new EventTarget();
    @inject titleService;
    @inject apiService;
    @inject storageService;
    @inject stateManagementService;
    #confirmationToken;
    #listenerDetails;

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
        if(this.#confirmationToken !== undefined) {
            this.apiService.confirmEmail(this.#confirmationToken)
                .then(()=>{
                    console.log("Email confirmed")
                })
                .catch(()=>{
                    this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_REGISTRATION));
                })
        }
        const loginLinkSlot = this.getSlot('login-link');
        const loginLink = new Link(loginLinkSlot, "Go to Log In page");
        loginLink.onClick(() => {
            this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT_LOGIN));
        })
    }

    init() {
        super.init();
        this.#listenerDetails = this.stateManagementService.addStateListener('locationMetadata', (state) => {
            this.setConfirmationToken(state.locationMetadata.confirmationToken)
        })
    }

    setConfirmationToken(token) {
        this.#confirmationToken = token
        this.render()
    }

    onDestroy() {
        super.onDestroy();
    }

    /**
     * Adds listener on navigate to login event.
     *
     * @param {Function} listener
     */
    onNavigateToLogin(listener) {
        this.#eventTarget.addEventListener(NAVIGATE_EVENT_LOGIN, listener);
    }

    /**
     * Adds listener on navigate to registration event.
     *
     * @param {Function} listener
     */
    onNavigateToRegistration(listener) {
        this.#eventTarget.addEventListener(NAVIGATE_EVENT_REGISTRATION, listener);
    }

    /**
     * @inheritDoc
     */
    markup() {
        return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="FileHub"><img alt="FileHub" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Email Confirmation</h1>
        <hr class="horizontal-line">
        <p>Your email successfully confirmed.</p>
        <br>
        ${this.addSlot('login-link')}
    </main>
</div>
    `;
    }
}
