import {Preconditions} from '../preconditions';

/**
 * Config for {@link Router}
 */
class RouterConfig {
  #pathToRouteMap;
  #errorRoute;
  #homeRoutePath;

  /**
   * @param {Object.<string, function(): void>} pathToRouteMap
   * @param {function(): void} errorRoute
   * @param {string} homeRoutePath
   */
  constructor(pathToRouteMap, errorRoute, homeRoutePath) {
    Preconditions.checkType(pathToRouteMap, 'object');
    Object.entries(pathToRouteMap).forEach(([key, value]) => {
      Preconditions.checkType(key, 'string');
      Preconditions.checkType(value, 'function');
    });
    Preconditions.checkType(homeRoutePath, 'string');
    Preconditions.checkType(errorRoute, 'function');

    this.#pathToRouteMap = pathToRouteMap;
    this.#errorRoute = errorRoute;
    this.#homeRoutePath = homeRoutePath;
  }

  /**
   * @returns {Object.<string, function(): void>}
   */
  get routesMap() {
    return this.#pathToRouteMap;
  }

  /**
   * @returns {function(): void}
   */
  get errorRoute() {
    return this.#errorRoute;
  }

  /**
   * @returns {string}
   */
  get homeRoutePath() {
    return this.#homeRoutePath;
  }
}

/**
 * Builder for {@link RouterConfig}.
 */
export class RouterConfigBuilder {
  #pathToRouteMap = {};
  #errorRoute;
  #homeRoutePath;

  /**
   * Adds page to router config.
   *
   * @param {string} path
   * @param {function(): void} route
   * @returns {RouterConfigBuilder}
   */
  addRoute(path, route) {
    this.#pathToRouteMap[path] = route;
    return this;
  }

  /**
   * Adds error404 page to router config.
   *
   * @param {function(): void} route
   * @returns {RouterConfigBuilder}
   */
  addErrorRoute(route) {
    this.#errorRoute = route;
    return this;
  }

  /**
   * Adds home page name to router  config.
   *
   * @param {string} path
   * @returns {RouterConfigBuilder}
   */
  addHomeRoutePath(path) {
    this.#homeRoutePath = path;
    return this;
  }

  /**
   * @returns {RouterConfig}
   */
  build() {
    return new RouterConfig(
        this.#pathToRouteMap,
        this.#errorRoute,
        this.#homeRoutePath);
  }
}
