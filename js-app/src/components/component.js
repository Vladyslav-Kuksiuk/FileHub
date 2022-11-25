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
    const observer = new MutationObserver((mutationRecords)=>{
      if (mutationRecords.filter((record)=>Array.from(record.removedNodes)
          .includes(this.rootElement)).length > 0) {
        this.onDestroy();
      }
    });

    observer.observe(this.parentElement, {'childList': true});
  }

  /**
   * Calls after each render.
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
   * Calls after root element removed.
   *
   * @protected
   */
  onDestroy() {

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
    const tempElement = document.createElement('template');
    tempElement.innerHTML = this.markup();
    return tempElement.content.firstElementChild;
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
