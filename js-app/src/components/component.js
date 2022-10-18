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
  }

  /**
   * Method calls before first render.
   */
  init() {
    this.render();
  }

  /**
   * Method calls after first render.
   */
  afterRender() {

  }

  /**
   * Creates html slot with mark.
   *
   * @param {string} name
   * @returns {string}
   */
  addSlot(name) {
    return `<slot data-td="${name}"></slot>`;
  }

  /**
   * Finds html slot by mark.
   *
   * @param {string} name
   * @returns {HTMLElement}
   */
  getSlot(name) {
    return this.rootElement.querySelector(`[data-td="${name}"]`);
  }

  /**
   * Render component in parent.
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
   * Returns html attribute to mark element.
   *
   * @param {string} name
   * @returns {string}
   */
  markElement(name) {
    return `data-td="${name}"`;
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
