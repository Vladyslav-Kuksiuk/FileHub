/**
 * Class to provide routing.
 */
export class Router {
  #pages = {};
  #defaultPageCreator;
  #error404PageCreator;

  /**
   * @param {function(HTMLElement)} pageCreator
   */
  set defaultPage(pageCreator) {
    this.#defaultPageCreator = pageCreator;
  }

  /**
   * @param {function(HTMLElement)} pageCreator
   */
  set error404Page(pageCreator) {
    this.#defaultPageCreator = pageCreator;
  }

  /**
   * @param {string} pageName
   * @param {function(HTMLElement)} pageCreator
   */
  addPage(pageName, pageCreator) {
    this.#pages[pageName] = pageCreator;
  }

  /**
   * @param {string} pageName
   * @returns {function(HTMLElement)}
   */
  getPage(pageName) {
    if (!!this.#pages[pageName]) {
      return this.#pages[pageName];
    } else if (pageName === '') {
      return this.#defaultPageCreator;
    } else {
      this.#error404PageCreator;
    }
  }
}
