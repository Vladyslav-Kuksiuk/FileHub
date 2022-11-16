import {METADATA_CHANGE_EVENT, RouterConfig} from './router-config';
/**
 * Service for handling routes along the given paths.
 */
export class Router {
  #config;
  #currentRoutePath;

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
      this.#config.eventTarget.dispatchEvent(new CustomEvent(METADATA_CHANGE_EVENT, {detail: {metadata: {}}}));
      this.#currentRoutePath = this.#config.homeRoutePath;
      this.#config.routesMap[this.#config.homeRoutePath]();
      return;
    }

    const parsedRoute = this.#parseWithParams(path);
    if (parsedRoute.routePath) {
      this.#config.eventTarget.dispatchEvent(new CustomEvent(METADATA_CHANGE_EVENT, {
        detail: {
          metadata: parsedRoute.params,
        },
      }));

      if (this.#currentRoutePath !== parsedRoute.routePath) {
        this.#currentRoutePath = parsedRoute.routePath;
        this.#config.routesMap[parsedRoute.routePath](parsedRoute.params);
      }
      return;
    }

    this.#config.eventTarget.dispatchEvent(new CustomEvent(METADATA_CHANGE_EVENT, {detail: {metadata: {}}}));
    this.#config.errorRoute();
  }

  /**
   * @param {string} path
   * @returns {{routePath: {string}, params: {}}}
   * @private
   */
  #parseWithParams(path) {
    const pathArray = path.split('/');
    let params = {};
    let parsedRoutePath;

    Object.keys(this.#config.routesMap).some((routePath)=>{
      parsedRoutePath = routePath;
      const routeArray = routePath.split('/');
      return routeArray.every((routePart, index)=>{
        if (routePart.startsWith(':')) {
          params[routePart.substring(1)] = pathArray[index];
        } else if (routePart !== pathArray[index]) {
          parsedRoutePath = null;
          params = {};
          return false;
        }
        return true;
      });
    });
    return {
      routePath: parsedRoutePath,
      params: params,
    };
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
