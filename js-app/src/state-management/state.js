import {UserProfile} from './user/user-profile';
import {FolderInfo} from './folder/folder-info';

/**
 * State.
 */
export class State {
  /**
   * @type {boolean}
   */
  isUserProfileLoading = true;

  /**
   * @type {boolean}
   */
  isFolderInfoLoading = true;

  /**
   * @type {UserProfile}
   */
  userProfile = null;

  /**
   * @type {string}
   */
  userProfileError = null;

  /**
   * @type {string}
   */
  folderInfoError = null;

  /**
   * @type {FolderInfo}
   */
  folderInfo = null;

  /**
   * @param {object} state
   */
  constructor(state = {}) {
    this.#setOwnProperties(state);
    this.#deepFreeze(this);
  }

  /**
   * @param {object} source
   * @private
   */
  #setOwnProperties(source) {
    const properties = Object.keys(this);
    const entries = Object.entries(source)
        .filter(([key]) => properties.includes(key));
    entries.forEach(([key, value]) => this[key] = value);
  }

  /**
   * @param {object} object
   * @returns {object}
   * @private
   */
  #deepFreeze(object) {
    Object.getOwnPropertyNames(object).forEach((name) => {
      const value = object[name];

      if (value && typeof value === 'object') {
        this.#deepFreeze(value);
      }
    });
    return Object.freeze(object);
  }
}
