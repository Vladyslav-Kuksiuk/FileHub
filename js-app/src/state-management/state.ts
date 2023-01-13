import {UserProfile} from './user/user-profile';
import {FolderInfo} from './folder/folder-info';
import {FolderContentItem} from './folder/folder-content-item';

/**
 * State.
 */
export class State {
  /**
   * @type {boolean}
   */
  isUserProfileLoading = false;

  /**
   * @type {boolean}
   */
  isFolderInfoLoading = false;

  /**
   * @type {boolean}
   */
  isFolderContentLoading = false;

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
   * @type {FolderContentItem[]}
   */
  folderContent = null;

  /**
   * @type {string}
   */
  folderContentError = null;

  /**
   * @type {object}
   */
  locationMetadata = {};

  /**
   * @type {FolderContentItem}
   */
  itemInRemovingState = null;

  /**
   * @type {boolean}
   */
  isItemDeleting = false;

  /**
   * @type {string}
   */
  itemDeletingError = null;

  /**
   * @type {boolean}
   */
  isFolderCreationModalOpen = false;

  /**
   * @type {FolderContentItem}
   */
  folderInCreationState = null;
  /**
   * @type {string | null}
   */
  folderCreationError = null;

  /**
   * @type {string[]}
   */
  foldersToUpload = [];

  /**
   * @type {Object<string, string>}
   */
  filesUploadingErrorInfo = {};

  /**
   * @type {string[]}
   */
  downloadingFiles = [];

  /**
   * @type {Object<string, string>}
   */
  filesDownloadingError = {};

  /**
   * @type {FolderContentItem | null}
   */
  renamingItem = null;

  /**
   * @type {boolean}
   */
  isItemRenaming = false;

  /**
   * @type {string[]}
   */
  itemRenamingErrors = [];

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
  #setOwnProperties(source : any) {
    const properties = Object.keys(this);
    const entries = Object.entries(source)
        .filter(([key])=>properties.includes(key));
    entries.forEach(([key, value]) => (this as any)[key] = value);
  }

  /**
   * @param {object} object
   * @returns {object}
   * @private
   */
  #deepFreeze(object : any) {
    Object.getOwnPropertyNames(object).forEach((name) => {
      const value = (object)[name];

      if (value && typeof value === 'object') {
        this.#deepFreeze(value);
      }
    });
    return Object.freeze(object);
  }
}
