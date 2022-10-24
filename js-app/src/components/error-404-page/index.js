import {Component} from '../component';
import {Link} from '../link';

const NAVIGATE_EVENT = 'NAVIGATE_EVENT';

/**
 * Error 404 page component.
 */
export class Error404Page extends Component {
  #eventTarget = new EventTarget();

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    super(parent);
    this.init();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    const linkSlot = this.getSlot('link');
    const link = new Link(linkSlot, 'Go Home');

    link.onClick(()=>{
      this.#eventTarget.dispatchEvent(new Event(NAVIGATE_EVENT));
    });
  }

  /**
   * Adds event listener on navigate to registration.
   *
   * @param {function} listener
   */
  onNavigateToHome(listener) {
    this.#eventTarget.addEventListener(NAVIGATE_EVENT, listener);
  }

  /**
   * @inheritDoc
   */
  markup() {
    return `
    <div class="page-wrapper">
    <header class="page-header">
        <a href="" title="TeamDev"><img alt="TeamDev" height="37" src="static/images/logo.png" width="200"></a>
    </header>
    <main class="container">
        <h1>Error 404 | Page Not Foud</h1>
        <hr class="horizontal-line">
        ${this.addSlot('link')}
    </main>
</div>
    `;
  }
}
