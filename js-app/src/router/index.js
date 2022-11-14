import {RouterConfig} from './router-config';
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
      return;
    }

    const parsedRoute = this.#parseWithParams(path);
    if (parsedRoute.route) {
      parsedRoute.route(parsedRoute.params);
      return;
    }

    this.#config.errorRoute();
  }

  /**
   * @param {string} path
   * @returns {{route: {function}, params: {}}}
   * @private
   */
  #parseWithParams(path) {
    const pathArray = path.split('/');
    let params = {};
    let route;

    Object.keys(this.#config.routesMap).some((routePath)=>{
      route = this.#config.routesMap[routePath];
      const routeArray = routePath.split('/');
      return routeArray.every((routePart, index)=>{
        if (routePart.startsWith(':')) {
          params[routePart.substring(1)] = pathArray[index];
        } else if (routePart !== pathArray[index]) {
          route = null;
          params = {};
          return false;
        }
        return true;
      });
    });
    return {
      route: route,
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
