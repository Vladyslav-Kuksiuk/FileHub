import {Preconditions} from './preconditions.js';

/**
 * Class to provide routing.
 */
export class Router {
  #routes = {};
  #homeRouteName;
  #errorRoute;

  /**
   * @param {object} pages
   * @param {string} homePageName
   * @param {function(HTMLElement)} errorPageCreator
   */
  constructor(pages, homePageName, errorPageCreator) {
    Preconditions.checkType(pages, 'object');
    Object.entries(pages).forEach(([key, value])=>{
      Preconditions.checkType(key, 'string');
      Preconditions.checkType(value, 'function');
    });
    Preconditions.checkType(homePageName, 'string');
    Preconditions.checkType(errorPageCreator, 'function');
    this.#routes = pages;
    this.#homeRouteName = homePageName;
    this.#errorRoute = errorPageCreator;

    window.addEventListener('hashchange', () => {
      this.#routeHandler(window.location.hash.replace('#', ''));
    });

    this.#routeHandler(window.location.hash.replace('#', ''));
  }

  /**
   * Renders page in root element.
   *
   * @param {string} routeName
   */
  #routeHandler(routeName) {
    if (routeName === '') {
      this.#routes[this.#homeRouteName]();
    } else if (this.#routes[routeName]) {
      this.#routes[routeName]();
    } else {
      this.#errorRoute();
    }
  }

  /**
   * Creates {@link RouterBuilder}.
   *
   * @returns {RouterBuilder}
   */
  static getBuilder() {
    return new RouterBuilder();
  }

  /**
   * Redirects to given page.
   *
   * @param {string} routeName
   */
  redirect(routeName) {
    window.location.hash = routeName;
  }
}

/**
 * Builder for {@link Router}.
 */
class RouterBuilder {
  #routes = {};
  #errorRoute;
  #homeRouteName;


  /**
   * Adds page to router.
   *
   * @param {string} name
   * @param {function(HTMLElement)} route
   * @returns {RouterBuilder}
   */
  addRoute(name, route) {
    this.#routes[name] = route;
    return this;
  }

  /**
   * Adds error404 page to router.
   *
   * @param {function(HTMLElement)} route
   * @returns {RouterBuilder}
   */
  addErrorRoute(route) {
    this.#errorRoute = route;
    return this;
  }

  /**
   * Adds home page name to router.
   *
   * @param {string} name
   * @returns {RouterBuilder}
   */
  addHomeRouteName(name) {
    this.#homeRouteName = name;
    return this;
  }

  /**
   * Creates {@link Router}.
   *
   * @returns {Router}
   */
  build() {
    return new Router(
        this.#routes,
        this.#homeRouteName,
        this.#errorRoute);
  }
}
