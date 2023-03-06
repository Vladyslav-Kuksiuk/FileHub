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
  }

  /**
   * Handles path from url.
   */
  handleUrlPath() {
    this.#handleRoute(window.location.hash.replace('#', ''));
  }

  /**
   * Handles route by given path.
   *
   * @param {string} path
   */
  #handleRoute(path) {
    if (path === '') {
      setTimeout(()=>{
        this.#config.eventTarget.dispatchEvent(new CustomEvent(METADATA_CHANGE_EVENT, {detail: {metadata: {}}}));
      });
      this.#currentRoutePath = this.#config.homeRoutePath;
      this.#config.routesMap[this.#config.homeRoutePath]();
      return;
    }

    const parsedRoute = this.#parseWithParams(path);
    if (parsedRoute.routePath) {
      setTimeout(()=>{
        this.#config.eventTarget.dispatchEvent(new CustomEvent(METADATA_CHANGE_EVENT, {
          detail: {
            metadata: parsedRoute.params,
          },
        }));
      });

      if (this.#currentRoutePath !== parsedRoute.routePath) {
        this.#currentRoutePath = parsedRoute.routePath;
        this.#config.routesMap[parsedRoute.routePath](parsedRoute.params);
      }
      return;
    }

    setTimeout(()=>{
      this.#config.eventTarget.dispatchEvent(new CustomEvent(METADATA_CHANGE_EVENT, {detail: {metadata: {}}}));
    });
    this.#config.errorRoute();
  }

  /**
   * @param {string} path
   * @returns {{routePath: {string}, params: {}}}
   * @private
   */
  #parseWithParams(path) {
    const params = {};
    // Parse parameters
    const pathWithParamsArray = path.split('?');
    if (pathWithParamsArray.length === 2) {
      const paramsArr = pathWithParamsArray[1].split('&');
      paramsArr.forEach((param) => {
        const keyValue = param.split('=');
        params[keyValue[0]] = keyValue[1];
      });
    }

    // Parse path with dynamic parts
    let dynamicParams = {};
    const pathArray = pathWithParamsArray[0].split('/');
    let parsedRoutePath;

    Object.keys(this.#config.routesMap).some((routePath)=>{
      parsedRoutePath = routePath;
      const routeArray = routePath.split('/');
      return routeArray.every((routePart, index)=>{
        if (routePart.startsWith(':')) {
          dynamicParams[routePart.substring(1)] = pathArray[index];
        } else if (routePart !== pathArray[index]) {
          parsedRoutePath = null;
          dynamicParams = {};
          return false;
        }
        return true;
      });
    });
    return {
      routePath: parsedRoutePath,
      params: {...params, ...dynamicParams},
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
