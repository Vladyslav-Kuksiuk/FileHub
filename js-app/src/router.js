/**
 * Class to provide routing.
 */
export class Router {
  #rootElement;
  #pages = {};
  #homePageName;
  #errorPageCreator;

  /**
   * @param {HTMLElement} rootElement
   * @param {Object} pages
   * @param {string} homePageName
   * @param {function(HTMLElement)} errorPageCreator
   */
  constructor(rootElement, pages, homePageName, errorPageCreator) {
    this.#rootElement = rootElement;
    this.#pages = pages;
    this.#homePageName = homePageName;
    this.#errorPageCreator = errorPageCreator;

    window.addEventListener('hashchange', () => {
      this.#renderPage(window.location.hash.replace('#', ''));
    });

    this.#renderPage(window.location.hash.replace('#', ''));
  }

  /**
   * Renders page in root element.
   * @param {string} pageName
   */
  #renderPage(pageName) {
    this.#rootElement.innerHTML = '';
    if (pageName === '') {
      this.#pages[this.#homePageName](this.#rootElement);
    } else if (this.#pages[pageName]) {
      this.#pages[pageName](this.#rootElement);
    } else {
      this.#errorPageCreator(this.#rootElement);
    }
  }

  /**
   *
   * @returns {RouterBuilder}
   */
  static getBuilder() {
    return new RouterBuilder();
  }

  /**
   * Redirects to given page.
   *
   * @param {string} pageName
   */
  redirect(pageName) {
    window.location.hash = pageName;
  }
}

/**
 * Builder for {@link Router}.
 */
class RouterBuilder {
  #rootElement;
  #pages = {};
  #errorPageCreator;
  #homePageName;

  /**
   * Adds root element to render components in it.
   *
   * @param {HTMLElement} element
   * @returns {RouterBuilder}
   */
  addRootElement(element) {
    this.#rootElement = element;
    return this;
  }

  /**
   * Adds page to router.
   *
   * @param {string} name
   * @param {function(HTMLElement)} creator
   * @returns {RouterBuilder}
   */
  addPage(name, creator) {
    this.#pages[name] = creator;
    return this;
  }

  /**
   * Adds error404 page to router.
   *
   * @param {function(HTMLElement)} creator
   * @returns {RouterBuilder}
   */
  addErrorPage(creator) {
    this.#errorPageCreator = creator;
    return this;
  }

  /**
   * Adds home page name to router.
   *
   * @param {string} name
   * @returns {RouterBuilder}
   */
  addHomePageName(name) {
    this.#homePageName = name;
    return this;
  }

  /**
   * @returns {Router}
   */
  build() {
    return new Router(this.#rootElement,
        this.#pages,
        this.#homePageName,
        this.#errorPageCreator);
  }
}
