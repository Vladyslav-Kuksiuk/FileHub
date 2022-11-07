export const FOLDER_TYPE = 'folder';

export const STATE = {
  IS_USER_PROFILE_LOADING: 'isUserProfileLoading',
  IS_FOLDER_INFO_LOADING: 'isFolderLoading',
  USER_PROFILE: 'userProfile',
  USER_PROFILE_ERROR: 'userProfileError',
  FOLDER_INFO_ERROR: 'folderError',
  FOLDER_INFO: 'folderInfo',
  IS_FOLDER_CONTENT_LOADING: 'isFolderContentLoading',
  FOLDER_CONTENT: 'folderContent',
  FOLDER_CONTENT_ERROR: 'folderContentError',
};

export const USER_PROFILE = {
  USERNAME: 'username',
  ROOT_FOLDER_ID: 'rootFolderId',
};

export const FOLDER_INFO = {
  NAME: 'name',
  ID: 'id',
  PARENT_ID: 'parentId',
  ITEMS_AMOUNT: 'itemsAmount',
};

export const FOLDER_CONTENT_ITEM = {
  TYPE: 'type',
  ID: 'id',
  NAME: 'name',
  SIZE: 'size',
};
