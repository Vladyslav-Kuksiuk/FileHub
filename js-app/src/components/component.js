/**
 * Virtual DOM of the element.
 */
export class Component {
  parentElement;
  rootElement;

  /**
   * @param {HTMLElement} parent
   */
  constructor(parent) {
    this.parentElement = parent;
    this.beforeRender();
    this.render();

  }

  /**
   * Method calls before first render
   */
  beforeRender() {

  }

  /**
   * Method calls after first render
   */
  afterRender() {

  }

  /**
   * @param {string} name
   * @returns {string}
   */
  addSlot(name) {
    return `<slot data-td="${name}"></slot>`;
  }

  /**
   * @param {string} name
   * @returns {HTMLElement}
   */
  getSlot(name) {
    return this.rootElement.querySelector(`[data-td="${name}"]`);
  }

  /**
   * Render component in DOM.
   */
  render() {
    this.#createDomTree();
    this.afterRender();
  }

  /**
   * Create element from markup and set it into HTML document.
   */
  #createDomTree() {
    const isFirstRendering = !this.rootElement;
    const newElement = this.#createNewElement();

    if (isFirstRendering) {
      this.parentElement.appendChild(newElement);
    } else {
      this.rootElement.replaceWith(newElement);
    }

    this.rootElement = newElement;
  }

  /**
   * Creates new {HTMLElement} by markup.
   *
   * @returns {HTMLElement}
   */
  #createNewElement() {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.markup();
    return tempElement.firstElementChild;
  }

  /**
   * Returns element's HTML as string.
   *
   * @abstract
   * @returns {string}
   */
  markup() {
    throw new Error('Method of Abstract Class cannot be called');
  }
}
