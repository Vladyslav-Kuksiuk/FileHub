import {FieldValidationError} from './field-validation-error';
import {UserData} from '../user-data';
import {ApiServiceError} from './api-service-error';
import {UserProfile} from '../state-management/user/user-profile';
import {FolderInfo} from '../state-management/folder/folder-info';
import {FolderContentItem} from '../state-management/folder/folder-content-item';
import {AUTH_TOKEN, ADMIN_AUTH_TOKEN} from '../storage-service';
import {inject} from '../registry';

export const LOG_IN_USER_PATH = 'api/login';
export const LOG_IN_ADMIN_PATH = 'api/login-admin';
export const BAN_USER_PATH = 'api/user/ban';
export const UNBAN_USER_PATH = 'api/user/unban';
export const DELETE_USER_FILES_PATH = 'api/user/delete-files';
export const REGISTER_USER_PATH = 'api/register';
export const LOAD_USER_PATH = 'api/user';
export const LOAD_FOLDER_PATH = 'api/folders/';
export const LOG_OUT_USER_PATH = 'api/logout';
export const SHARE_FILE_PATH = 'api/file/share';
export const VIEW_SHARED_FILE_PATH = 'api/shared-file/view/';
export const DOWNLOAD_SHARED_FILE_PATH = 'api/shared-file/download/';
export const STOP_SHARING_FILE_PATH = 'api/file/stop-sharing';
export const EMAIL_CONFIRMATION_PATH = 'api/confirm-email/';
export const SEND_CONFIRMATION_EMAIL_PATH = 'api/send-confirmation-email';
export const LOAD_FILES_STATISTICS_PATH = 'api/files-statistics';
export const LOAD_USER_STATISTICS_PATH = 'api/user-statistics/';
const FOLDER_PATH = 'api/folder/';
const FILE_PATH = 'api/file/';

export const LOGIN_401_ERROR = 'Invalid login or password';
export const LOGIN_403_ERROR = 'Email address is not confirmed';
export const LOGIN_423_ERROR = 'User banned';
export const EMAIL_ERROR = 'User with provided email doesn\'t exist';

/**
 * Service to handle server request and response.
 */
export class ApiService {
  @inject requestService;
  @inject storageService;
  #redirectToLogin;

  /**
   * @param {function(): void} redirectToLogin
   */
  set redirectToLogin(redirectToLogin) {
    this.#redirectToLogin = redirectToLogin;
  }

  /**
   * Log in user.
   *
   * @param {UserData} data
   * @returns {Promise<ApiServiceError>}
   */
  async logIn(data) {
    return this.requestService.postJson(LOG_IN_USER_PATH, {
      login: data.login,
      password: data.password,
    }).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        throw new ApiServiceError(LOGIN_401_ERROR);
      }
      if (response.status === 403) {
        throw new ApiServiceError(LOGIN_403_ERROR);
      }
      if (response.status === 423) {
        throw new ApiServiceError(LOGIN_423_ERROR);
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      this.storageService.put(AUTH_TOKEN, response.body.authenticationToken);
    });
  }

  /**
   * Log in admin.
   *
   * @param {UserData} data
   * @returns {Promise<ApiServiceError>}
   */
  async logInAdmin(data) {
    return this.requestService.postJson(LOG_IN_ADMIN_PATH, {
      login: data.login,
      password: data.password,
    }).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        throw new ApiServiceError(LOGIN_401_ERROR);
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      this.storageService.put(ADMIN_AUTH_TOKEN, response.body.authenticationToken);
    });
  }

  /**
   * Sends confirmation email.
   *
   * @returns {Promise<ApiServiceError>}
   */
  async sendConfirmationEmail(email) {
    return this.requestService.postJson(SEND_CONFIRMATION_EMAIL_PATH, {
      email: email})
        .catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 404) {
        throw new ApiServiceError(EMAIL_ERROR);
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }

  /**
   * Confirms email.
   *
   * @returns {Promise<ApiServiceError>}
   */
  async confirmEmail(confirmationToken) {
    return this.requestService.postJson(EMAIL_CONFIRMATION_PATH+confirmationToken)
        .catch(()=>{
          throw new ApiServiceError();
        }).then((response) => {
          if (response.status === 404) {
            throw new ApiServiceError(EMAIL_ERROR);
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
        });
  }

  /**
   * Registers user.
   *
   * @param {UserData} data
   * @returns {Promise<ApiServiceError | FieldValidationError>}
   */
  async register(data) {
    return this.requestService.postJson(REGISTER_USER_PATH, {
      login: data.login,
      password: data.password,
    }).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 422) {
        throw new FieldValidationError(response.body.errors);
      }
      if (response.status === 409) {
        throw new ApiServiceError("User with provided email already exist.");
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }

  /**
   * Loads user data.
   *
   * @returns {Promise<UserProfile | ApiServiceError>}
   */
  async loadUser() {
    return this.requestService.getJson(LOAD_USER_PATH, this.storageService.get(AUTH_TOKEN)).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      return new UserProfile(
          response.body.login,
          response.body.rootFolderId,
      );
    }).catch(()=>{
      throw new ApiServiceError();
    });
  }

  /**
   * Loads shared file data.
   *
   * @returns {Promise<UserProfile | ApiServiceError>}
   */
  async viewSharedFile(tag) {
    return this.requestService.getJson(VIEW_SHARED_FILE_PATH + tag).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      let item = response.body
      return new FolderContentItem({
        type: item.type,
        id: item.id,
        parentId: item.parentId,
        name: item.name,
        size: item.size,
        mimetype: item.mimetype,
        itemsAmount: item.itemsAmount,
        archivedSize: item.archivedSize,
        extension: item.extension,
        shareTag: item.shareTag
      });
    }).catch(()=>{
      throw new ApiServiceError();
    });
  }

  /**
   * Loads folder info.
   *
   * @param {string} folderId
   * @returns {Promise<FolderInfo | ApiServiceError>}
   */
  async loadFolderInfo(folderId) {
    return this.requestService.getJson(LOAD_FOLDER_PATH+folderId, this.storageService.get(AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return new FolderInfo(
              response.body.name,
              response.body.id,
              response.body.parentId,
              response.body.itemsAmount,
          );
        });
  }

  /**
   * Loads folder content.
   *
   * @param {string} folderId
   * @returns {Promise<FolderContentItem[] | ApiServiceError>}
   */
  async loadFolderContent(folderId) {
    return this.requestService.getJson(LOAD_FOLDER_PATH+folderId+'/content', this.storageService.get(AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body.items.map((item)=>new FolderContentItem({
            type: item.type,
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            size: item.size,
            mimetype: item.mimetype,
            itemsAmount: item.itemsAmount,
            archivedSize: item.archivedSize,
            extension: item.extension,
            shareTag: item.shareTag
          }));
        });
  }

  /**
   * Loads files statistics.
   *
   * @returns {Promise< * | ApiServiceError>}
   */
  async loadFilesStatistics() {
    return this.requestService.getJson(LOAD_FILES_STATISTICS_PATH, this.storageService.get(ADMIN_AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body.items.map((item)=>{
            return {
              mimetype: item.mimetype,
              filesNumber: item.filesNumber,
              size: item.size,
              archivedSize: item.archivedSize,
            }
          });
        });
  }

  /**
   * Loads user statistics.
   *
   * @returns {Promise< * | ApiServiceError>}
   */
  async loadUserStatistics(email) {
    return this.requestService.getJson(LOAD_USER_STATISTICS_PATH + email, this.storageService.get(ADMIN_AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status === 404) {
            throw new ApiServiceError(EMAIL_ERROR, response.status);
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return {
            isBanned: response.body.isBanned,
            items: response.body.items.map((item)=>{
              return {
                mimetype: item.mimetype,
                filesNumber: item.filesNumber,
                size: item.size,
                archivedSize: item.archivedSize,
              }
            })
          }
        });
  }

  /**
   * Ban user.
   *
   * @param {String} email
   * @returns {Promise<ApiServiceError>}
   */
  async banUser(email) {
    return this.requestService.postJson(BAN_USER_PATH, {
      email: email,
    },this.storageService.get(ADMIN_AUTH_TOKEN)).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }

  /**
   * Share file.
   *
   * @param {String} file
   * @returns {Promise<ApiServiceError>}
   */
  async shareFile(file) {
    return this.requestService.postJson(SHARE_FILE_PATH, {
      file: file,
    },this.storageService.get(AUTH_TOKEN)).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      return {
        name: response.body.name,
        shareTag: response.body.shareTag
      }
    });
  }

  /**
   * Stop sharing file.
   *
   * @param {String} file
   * @returns {Promise<ApiServiceError>}
   */
  async stopSharingFile(file) {
    return this.requestService.postJson(STOP_SHARING_FILE_PATH, {
      file: file,
    },this.storageService.get(AUTH_TOKEN)).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
      return {
        name: response.body.name,
        shareTag: response.body.shareTag
      }
    });
  }

  /**
   * Unban user.
   *
   * @param {String} email
   * @returns {Promise<ApiServiceError>}
   */
  async unbanUser(email) {
    return this.requestService.postJson(UNBAN_USER_PATH, {
      email: email,
    },this.storageService.get(ADMIN_AUTH_TOKEN)).catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }

  /**
   * Delete user files.
   *
   * @param {String} email
   * @returns {Promise<ApiServiceError>}
   */
  async deleteUserFiles(email) {
    return this.requestService.postJson(DELETE_USER_FILES_PATH, {
      email: email,
    },this.storageService.get(ADMIN_AUTH_TOKEN))
        .catch(()=>{
      throw new ApiServiceError();
    }).then((response) => {
      if (response.status === 401) {
        this.#redirectToLogin();
        return;
      }
      if (response.status !== 200) {
        throw new ApiServiceError();
      }
    });
  }

  /**
   * Loads folder content by search.
   *
   * @param {string} folderId
   * @param {string} searchValue
   * @returns {Promise<FolderContentItem[] | ApiServiceError>}
   */
  async searchInFolder(folderId, searchValue) {
    return this.requestService.getJson(LOAD_FOLDER_PATH+folderId+'/search/'+searchValue,
        this.storageService.get(AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body.items.map((item)=>new FolderContentItem({
            type: item.type,
            id: item.id,
            parentId: item.parentId,
            name: item.name,
            size: item.size,
            mimetype: item.mimetype,
            itemsAmount: item.itemsAmount,
            archivedSize: item.archivedSize,
            extension: item.extension,
            shareTag: item.shareTag
          }));
        });
  }

  /**
   * Deletes item.
   *
   * @param {FolderContentItem} item
   */
  async deleteItem(item) {
    const path = item.type === 'folder' ? FOLDER_PATH : FILE_PATH;
    return this.requestService.delete(path+item.id, this.storageService.get(AUTH_TOKEN))
        .catch(() => {
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
        });
  }

  /**
   * Renames item.
   *
   * @param {FolderContentItem} item
   */
  async renameItem(item) {
    const path = item.type === 'folder' ? FOLDER_PATH : FILE_PATH;

    return this.requestService.put(path+item.id,
        {
          name: item.name,
        },
        this.storageService.get(AUTH_TOKEN))
        .catch(() => {
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.#redirectToLogin();
            return;
          }
          if (response.status === 422) {
            throw new FieldValidationError(response.body.errors);
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
        });
  }

  /**
   * Log out user.
   *
   * @returns {Promise<ApiServiceError>}
   */
  async logOut() {
    return this.requestService.postJson(LOG_OUT_USER_PATH, {}, this.storageService.get(AUTH_TOKEN))
        .catch(()=>{})
        .then(()=>{})
        .finally(() => {
          this.#redirectToLogin();
        });
  }

  /**
   * Logs out admin.
   *
   * @returns {Promise<ApiServiceError>}
   */
  async logOutAdmin() {
    this.storageService.clear();
    this.#redirectToLogin()
  }

  /**
   * Uploads files.
   *
   * @param {string} folderId
   * @param {File[]} files
   * @returns {Promise<ApiServiceError>}
   */
  async uploadFiles(folderId, files) {
    const formData = new FormData();
    [...files].forEach((file, index)=>{
      formData.append(`files_${index}`, file);
    });

    return this.requestService.postFormData(
        'api/folders/'+ folderId +'/content',
        formData,
        this.storageService.get(AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response)=>{
          if (response.status === 401) {
            this.storageService.put(AUTH_TOKEN, null);
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
        });
  }

  /**
   * Creates folder.
   *
   * @param {FolderContentItem} folder
   * @returns {Promise<ApiServiceError>}
   */
  async createFolder(folder) {
    return this.requestService.postJson(
        'api/folders',
        {
          name: folder.name,
          parentId: folder.parentId,
        },
        this.storageService.get(AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response)=>{
          if (response.status === 401) {
            this.storageService.put(AUTH_TOKEN, null);
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
        });
  }

  /**
   * Downloads file.
   *
   * @param {string} fileId
   * @returns {Promise<Blob | ApiServiceError>}
   */
  async downloadFile(fileId) {
    return this.requestService.getBlob('api/files/' + fileId, this.storageService.get(AUTH_TOKEN))
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.storageService.put(AUTH_TOKEN, null);
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body;
        });
  }

  /**
   * Downloads shared file.
   *
   * @param {string} shareTag
   * @returns {Promise<Blob | ApiServiceError>}
   */
  async downloadSharedFile(shareTag) {
    return this.requestService.getBlob(DOWNLOAD_SHARED_FILE_PATH + shareTag)
        .catch(()=>{
          throw new ApiServiceError();
        })
        .then((response) => {
          if (response.status === 401) {
            this.storageService.put(AUTH_TOKEN, null);
            this.#redirectToLogin();
            return;
          }
          if (response.status !== 200) {
            throw new ApiServiceError();
          }
          return response.body;
        });
  }
}
