import {RouterConfig} from './router-config';
/**
 * Class to provide routing.
 */
export class Router {
  #config;

  /**
   * @param {RouterConfig} config
   */
  constructor(config) {
    this.#config = config;
    window.addEventListener('hashchange', () => {
      this.#handleRoute(window.location.hash.replace('#', ''));
    });

    window.location.hash = config.homeRoutePath;
    this.#handleRoute(window.location.hash.replace('#', ''));
  }

  /**
   * Renders page in root element.
   * @param {string} routeName
   */
  #handleRoute(routeName) {
    if (routeName === '') {
      this.#config.routesMap[this.#config.homeRoutePath]();
    } else if (this.#config.routesMap[routeName]) {
      this.#config.routesMap[routeName]();
    } else {
      this.#config.errorRoute();
    }
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
