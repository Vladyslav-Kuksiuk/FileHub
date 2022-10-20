import {Preconditions} from '../preconditions.js';

/**
 * Config for {@link Router}.
 */
export class RouterConfig {
  #pathToRouteMap;
  #errorRoute;
  #homeRoutePath;

  /**
   * @param {object} pathToRouteMap - Object structure: {string} path : {Function} route.
   * @param {Function} errorRoute
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
   * @returns {object} - Object structure: {string} path : {function} route.
   */
  get routesMap() {
    return this.#pathToRouteMap;
  }

  /**
   * @returns {Function}
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
   * @param {Function} route
   * @returns {RouterConfigBuilder}
   */
  addRoute(path, route) {
    this.#pathToRouteMap[path] = route;
    return this;
  }

  /**
   * Adds error404 page to router config.
   *
   * @param {Function} route
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
   * Creates {@link RouterConfig}.
   *
   * @returns {RouterConfig}
   */
  build() {
    return new RouterConfig(
        this.#pathToRouteMap,
        this.#errorRoute,
        this.#homeRoutePath);
  }
}
