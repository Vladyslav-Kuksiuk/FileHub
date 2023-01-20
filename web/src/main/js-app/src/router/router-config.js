import {Preconditions} from '../preconditions';

export const METADATA_CHANGE_EVENT = 'METADATA_CHANGE_EVENT';
/**
 * Config for {@link Router}.
 */
export class RouterConfig {
  #pathToRouteMap;
  #errorRoute;
  #homeRoutePath;
  #eventTarget;

  /**
   * @param {object} pathToRouteMap - Object structure: {string} path : {Function} route.
   * @param {Function} errorRoute
   * @param {string} homeRoutePath
   * @param {EventTarget} eventTarget
   */
  constructor(pathToRouteMap, errorRoute, homeRoutePath, eventTarget) {
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
    this.#eventTarget = eventTarget;
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

  /**
   * @returns {EventTarget}
   */
  get eventTarget() {
    return this.#eventTarget;
  }
}

/**
 * Builder for {@link RouterConfig}.
 */
export class RouterConfigBuilder {
  #pathToRouteMap = {};
  #errorRoute;
  #homeRoutePath;
  #eventTarget = new EventTarget();

  /**
   * Adds page to router config.
   *
   * @param {string} path
   * @param {function(object)} route
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
   * Adds home page path to router config.
   *
   * @param {string} path
   * @returns {RouterConfigBuilder}
   */
  addHomeRoutePath(path) {
    this.#homeRoutePath = path;
    return this;
  }

  /**
   * Adds listener on metadata change event.
   *
   * @param {function(object)} listener - Listener receives metadata object.
   * @returns {RouterConfigBuilder}
   */
  addMetadataChangeListener(listener) {
    this.#eventTarget.addEventListener(METADATA_CHANGE_EVENT, (event)=>{
      listener(event.detail.metadata);
    });
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
        this.#homeRoutePath,
        this.#eventTarget);
  }
}
