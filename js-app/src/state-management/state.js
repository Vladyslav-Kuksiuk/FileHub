/**
 * @typedef {object} State
 * @property {boolean} isUserProfileLoading
 * @property {boolean} isFolderLoading
 * @property {string} userProfile
 * @property {string} userProfileError
 * @property {string} folderError
 * @property {string} folderInfo
 */

/**
 * @typedef {object} UserProfile
 * @property {string} username
 * @property {string} rootFolderId
 */

/**
 * @typedef {object} FolderInfo
 * @property {string} name
 * @property {string} id
 * @property {string} parentId
 * @property {number} itemsAmount
 */

export const STATE = {
  IS_USER_PROFILE_LOADING: 'isUserProfileLoading',
  IS_FOLDER_INFO_LOADING: 'isFolderLoading',
  USER_PROFILE: 'userProfile',
  USER_PROFILE_ERROR: 'userProfileError',
  FOLDER_INFO_ERROR: 'folderError',
  FOLDER_INFO: 'folderInfo',
};

// export const USER_PROFILE = {
//   USERNAME: 'username',
//   ROOT_FOLDER_ID: 'rootFolderId',
// };
//
// export const FOLDER_INFO = {
//   NAME: 'name',
//   ID: 'id',
//   PARENT_ID: 'parentId',
//   ITEMS_AMOUNT: 'itemsAmount',
// };
