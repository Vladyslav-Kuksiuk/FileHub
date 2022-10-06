/**
 * Javascript component.
 */
export class Component {
  parentElement;
  rootElement;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    this.parentElement = parent;
    this.render();
  }

  /**
   * Create element from mockup and set it into HTML document.
   */
  render() {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.mockup();
    const rootElement = tempElement.firstElementChild;

    this.rootElement = rootElement;
    this.parentElement.appendChild(rootElement);
  }

  /**
   * Returns element's HTML as string.
   *
   * @abstract
   * @returns {string}
   */
  mockup() {
    throw new Error('Method of Abstract Class cannot be called');
  }
}
