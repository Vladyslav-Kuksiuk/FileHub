import {RouterConfig} from './router-config.js';
/**
 * Service for handling routes along the given paths.
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
   * Handles route by given path.
   *
   * @param {string} path
   */
  #handleRoute(path) {
    if (path === '') {
      this.#config.routesMap[this.#config.homeRoutePath]();
    } else if (this.#config.routesMap[path]) {
      this.#config.routesMap[path]();
    } else {
      this.#config.errorRoute();
    }
  }

  /**
   * Redirects to given path.
   *
   * @param {string} path
   */
  redirect(path) {
    window.location.hash = path;
  }
}
