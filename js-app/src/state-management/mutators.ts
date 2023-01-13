import {State} from './state';
import {FolderContentItem} from './folder/folder-content-item';
import {FolderInfo} from './folder/folder-info';
import {UserProfile} from './user/user-profile';

export const MUTATOR_NAMES = {
  SET_IS_USER_PROFILE_LOADING: 'isUserProfileLoading',
  SET_USER_PROFILE: 'setUserProfile',
  SET_USER_PROFILE_ERROR: 'setUserProfileError',
  SET_IS_FOLDER_INFO_LOADING: 'isFolderInfoLoading',
  SET_FOLDER_INFO: 'setFolderInfo',
  SET_FOLDER_INFO_ERROR: 'setFolderInfoError',
  SET_IS_FOLDER_CONTENT_LOADING: 'isFolderContentLoading',
  SET_FOLDER_CONTENT: 'setFolderContent',
  SET_FOLDER_CONTENT_ERROR: 'setFolderContentError',
  SET_REMOVING_ITEM: 'setRemovingItem',
  SET_IS_ITEM_DELETING: 'setIsItemDeleting',
  SET_ITEM_DELETING_ERROR: 'setFItemDeletingError',
  SET_IS_FOLDER_CREATION_MODAL_OPEN: 'setIsFolderCreationModalOpen',
  SET_FOLDER_IN_CREATION_STATE: 'setFolderInCreationState',
  SET_FOLDER_CREATION_ERROR: 'setFolderCreationError',
  SET_LOCATION_METADATA: 'setLocationMetadata',
  ADD_FOLDER_TO_UPLOAD: 'addFolderToUpload',
  REMOVE_FOLDER_TO_UPLOAD: 'removeFolderToUpload',
  ADD_FILES_UPLOADING_ERROR_INFO: 'addFilesUploadingErrorInfo',
  ADD_DOWNLOADING_FILE: 'addDownloadingFile',
  REMOVE_DOWNLOADING_FILE: 'removeDownloadingFile',
  ADD_FILE_DOWNLOADING_ERROR: 'addFileDownloadingError',
  SET_RENAMING_ITEM: 'setRenamingItem',
  SET_IS_ITEM_RENAMING: 'setIsItemRenaming',
  SET_ITEM_RENAMING_ERRORS: 'setItemRenamingErrors',
  RESET_STATE: 'resetState',
};

export const MUTATORS = {
  [MUTATOR_NAMES.SET_IS_USER_PROFILE_LOADING]: (state : State, isLoading: boolean) =>{
    if (isLoading) {
      return new State({...state,
        isUserProfileLoading: isLoading,
        userProfile: null,
        userProfileError: null});
    }
    return new State({...state, isUserProfileLoading: isLoading});
  },
  [MUTATOR_NAMES.SET_USER_PROFILE]: (state : State, userProfile: UserProfile) =>{
    return new State({...state, userProfile: userProfile});
  },
  [MUTATOR_NAMES.SET_USER_PROFILE_ERROR]: (state : State, error: string) =>{
    return new State({...state, userProfileError: error});
  },

  [MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING]: (state : State, isLoading: boolean) =>{
    if (isLoading) {
      return new State({...state,
        isFolderInfoLoading: isLoading,
        folderInfo: null,
        folderInfoError: null});
    }
    return new State({...state, isFolderInfoLoading: isLoading});
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO]: (state : State, folderInfo: FolderInfo) =>{
    return new State({...state, folderInfo: folderInfo});
  },
  [MUTATOR_NAMES.SET_FOLDER_INFO_ERROR]: (state : State, error: string) =>{
    return new State({...state, folderInfoError: error});
  },

  [MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING]: (state : State, isLoading: boolean) =>{
    if (isLoading) {
      return new State({...state,
        isFolderContentLoading: isLoading,
        folderContent: null,
        folderContentError: null});
    }
    return new State({...state, isFolderContentLoading: isLoading});
  },
  [MUTATOR_NAMES.SET_FOLDER_CONTENT]: (state : State, folderContent: FolderContentItem[]) =>{
    let newState = {...state,
      folderContent: folderContent,
      filesUploadingErrorInfo: {},
      itemRenamingErrors: []};

    if (!state.isItemRenaming) {
      newState = {...newState, renamingItem: null};
    }

    return new State(newState);
  },
  [MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR]: (state : State, error : string) =>{
    return new State({...state, folderContentError: error});
  },

  [MUTATOR_NAMES.SET_IS_ITEM_DELETING]: (state : State, isDeleting: boolean) =>{
    if (isDeleting) {
      return new State({...state,
        isItemDeleting: isDeleting,
        itemDeletingError: null,
      });
    }

    if (!isDeleting && state.itemDeletingError) {
      return new State({...state,
        isItemDeleting: isDeleting,
      });
    }

    return new State({...state,
      isItemDeleting: isDeleting,
      itemInRemovingState: null,
    });
  },
  [MUTATOR_NAMES.SET_REMOVING_ITEM]: (state : State, item: FolderContentItem) =>{
    return new State({...state,
      itemInRemovingState: item,
      itemDeletingError: null,
    });
  },
  [MUTATOR_NAMES.SET_ITEM_DELETING_ERROR]: (state : State, error: string) =>{
    return new State({...state, itemDeletingError: error});
  },

  [MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE]: (state : State, folder: FolderContentItem) =>{
    if (folder) {
      return new State({...state,
        folderInCreationState: folder,
        folderCreationError: null,
      });
    }

    if (!folder && state.folderCreationError) {
      return new State({...state,
        folderInCreationState: folder,
      });
    }

    return new State({...state,
      folderInCreationState: folder,
      isFolderCreationModalOpen: false,
    });
  },
  [MUTATOR_NAMES.SET_IS_FOLDER_CREATION_MODAL_OPEN]: (state : State, isOpen: boolean) =>{
    return new State({...state,
      isFolderCreationModalOpen: isOpen,
      folderCreationError: null,
    });
  },
  [MUTATOR_NAMES.SET_FOLDER_CREATION_ERROR]: (state : State, error: string) =>{
    return new State({...state, folderCreationError: error});
  },

  [MUTATOR_NAMES.SET_LOCATION_METADATA]: (state : State, locationMetadata : object) =>{
    return new State({...state,
      locationMetadata: locationMetadata,
    });
  },

  [MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD]: (state : State, folderId : string) => {
    return new State({...state,
      foldersToUpload: [...state.foldersToUpload, folderId],
      filesUploadingErrorInfo: {
        ...state.filesUploadingErrorInfo,
        [folderId]: undefined,
      },
    });
  },
  [MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD]: (state : State, folderId: string) => {
    return new State({...state,
      foldersToUpload: state.foldersToUpload.filter((folder) => folder !== folderId),
    });
  },
  [MUTATOR_NAMES.ADD_FILES_UPLOADING_ERROR_INFO]: (state : State, errorInfo : {folderId:string, error:string}) => {
    return new State({...state,
      filesUploadingErrorInfo: {
        ...state.filesUploadingErrorInfo,
        [errorInfo.folderId]: errorInfo.error,
      },
    });
  },

  [MUTATOR_NAMES.ADD_DOWNLOADING_FILE]: (state : State, fileId : string) => {
    return new State({...state,
      downloadingFiles: [...state.downloadingFiles, fileId],
      filesDownloadingError: {
        ...state.filesDownloadingError,
        [fileId]: undefined,
      },
    });
  },
  [MUTATOR_NAMES.REMOVE_DOWNLOADING_FILE]: (state : State, fileId: string) => {
    return new State({...state,
      downloadingFiles: state.downloadingFiles.filter((file) => file !== fileId),
    });
  },
  [MUTATOR_NAMES.ADD_FILE_DOWNLOADING_ERROR]: (state : State, errorInfo : {fileId:string, error:string}) => {
    return new State({...state,
      filesDownloadingError: {
        ...state.filesDownloadingError,
        [errorInfo.fileId]: errorInfo.error,
      },
    });
  },

  [MUTATOR_NAMES.SET_RENAMING_ITEM]: (state : State, item: FolderContentItem) => {
    if (item) {
      return new State({...state,
        renamingItem: item,
        itemRenamingErrors: [],
      });
    }

    return new State({...state,
      isItemRenaming: false,
      renamingItem: item,
      itemRenamingErrors: [],
    });
  },
  [MUTATOR_NAMES.SET_IS_ITEM_RENAMING]: (state : State, isRenaming: boolean) => {
    return new State({...state,
      isItemRenaming: isRenaming,
      itemRenamingErrors: [],
    });
  },
  [MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS]: (state : State, errors: string[]) => {
    return new State({...state,
      isItemRenaming: false,
      itemRenamingErrors: errors,
    });
  },

  [MUTATOR_NAMES.RESET_STATE]: () => {
    return new State();
  },
};
