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
   * Initiates component.
   *
   * @protected
   */
  init() {
    this.render();
  }

  /**
   * Called after each render.
   *
   * @protected
   */
  afterRender() {

  }

  /**
   * Creates slot with name.
   *
   * @param {string} name
   * @returns {string}
   * @protected
   */
  addSlot(name) {
    return `<slot data-td="${name}"></slot>`;
  }

  /**
   * Returns slot by name.
   *
   * @param {string} name
   * @returns {HTMLElement}
   * @protected
   */
  getSlot(name) {
    return this.rootElement.querySelector(`[data-td="${name}"]`);
  }

  /**
   * Render component in parent.
   *
   * @protected
   */
  render() {
    this.#createDomTree();
    this.afterRender();
  }

  /**
   * @private
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
   * @protected
   */
  markElement(name) {
    return `data-td="${name}"`;
  }

  /**
   * @returns {HTMLElement}
   * @private
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
