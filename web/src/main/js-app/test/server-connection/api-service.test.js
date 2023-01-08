import {Response} from '../../src/server-connection/response';
import {
  ApiService,
  LOGIN_401_ERROR,
  LOG_IN_USER_PATH,
  REGISTER_USER_PATH,
  LOAD_FOLDER_PATH,
  LOAD_USER_PATH,
  LOG_OUT_USER_PATH
} from '../../src/server-connection/api-service';
import {DEFAULT_ERROR} from '../../src/server-connection/api-service-error';
import {UserData} from '../../src/user-data';
import {jest} from '@jest/globals';
import {ApiServiceError} from '../../src/server-connection/api-service-error';
import {FieldValidationError} from '../../src/server-connection/field-validation-error';
import {FolderInfo} from '../../src/state-management/folder/folder-info.js';
import {UserProfile} from '../../src/state-management/user/user-profile.js';
import {FolderContentItem} from '../../src/state-management/folder/folder-content-item';
import {clearRegistry, registry} from '../../src/registry';

describe('ApiService', () => {
  const login = 'login';
  const password = 'password';
  let requestService;
  let storageService;

  beforeEach(()=>{
    clearRegistry();

    requestService = {
      postJson: () => {},
      put: () => {},
      postFormData: () => {},
      getJson: () => {},
      getBlob: () => {},
      delete: () => {},
    };

    storageService = {
      put: jest.fn(),
      get: jest.fn(),
    };

    registry.register('requestService', ()=>{
      return requestService;
    });

    registry.register('storageService', ()=>{
      return storageService;
    });
  });

  describe('logIn', () => {
    test(`Should successfully log in`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async (url, body) => {
            return new Response(200, {authenticationToken: 'myToken'});
          });

      const apiService = new ApiService();

      await expect(apiService.logIn(new UserData(login, password))).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {login: login, password: password});
    });

    test(`Should return error after login with error message ${DEFAULT_ERROR}`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(400, {});
          });

      const apiService = new ApiService();

      await expect(apiService.logIn(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {login: login, password: password});
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();

      await expect(apiService.logIn(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {login: login, password: password});
    });

    test(`Should return error after login with error message ${LOGIN_401_ERROR}`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();

      await expect(apiService.logIn(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError(LOGIN_401_ERROR));
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {login: login, password: password});
    });
  });

  describe('register', () => {
    test(`Should successfully register`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(200, {token: 'myToken'});
          });

      const apiService = new ApiService();

      await expect(apiService.register(new UserData(login, password))).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH, {login: login, password: password});
    });

    test(`Should return error after registration with error message ${DEFAULT_ERROR}`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(400, {});
          });

      const apiService = new ApiService();

      await expect(apiService.register(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH, {login: login, password: password});
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();

      await expect(apiService.register(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH, {login: login, password: password});
    });

    test(`Should return error after registration with errors in response body`, async function() {
      expect.assertions(3);
      const errors = [
        {
          fieldName: 'email',
          errorText: 'Email error',
        },
        {
          fieldName: 'password',
          errorText: 'Password error',
        },
      ];

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(422, {errors: errors});
          });

      const apiService = new ApiService();

      await expect(apiService.register(new UserData('login', 'password')))
          .rejects.toEqual(new FieldValidationError(errors));
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH,
          {login: login, password: password});
    });
  });

  describe('logOut', () => {
    test(`Should successfully log out on successfully server response`, async function() {
      expect.assertions(4);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(200, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;

      await expect(apiService.logOut()).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_OUT_USER_PATH, {}, undefined);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should successfully log out on error server response`, async function() {
      expect.assertions(4);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(402, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;

      await expect(apiService.logOut()).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_OUT_USER_PATH, {}, undefined);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should successfully log out on error in fetch`, async function() {
      expect.assertions(4);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;

      await expect(apiService.logOut()).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_OUT_USER_PATH, {}, undefined);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadUser', () => {
    test(`Should successfully load user`, async function() {
      expect.assertions(3);

      const userProfile = new UserProfile(
          'testUser',
          'rootFolder',
      );

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(200, {
              userProfile: {
                username: userProfile.username,
                rootFolderId: userProfile.rootFolderId,
              },
            });
          });

      const apiService = new ApiService();

      await expect(apiService.loadUser()).resolves.toStrictEqual(userProfile);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_USER_PATH, undefined);
    });

    test(`Should return error after user loading`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.loadUser()).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_USER_PATH, undefined);
    });

    test(`Should redirect to login at 401 error after user loading`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.loadUser();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.loadUser()).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_USER_PATH, undefined);
    });
  });

  describe('loadFolderInfo', () => {
    test(`Should successfully load folder info`, async function() {
      expect.assertions(3);

      const folderInfo = new FolderInfo(
          'folderName',
          'folderId',
          'parentId',
          10,
      );

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(200, {
              folderInfo: {
                name: folderInfo.name,
                parentId: folderInfo.parentId,
                id: folderInfo.id,
                itemsAmount: folderInfo.itemsAmount,
              },
            });
          });

      const apiService = new ApiService();
      await expect(apiService.loadFolderInfo(folderInfo.id)).resolves.toStrictEqual(folderInfo);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + folderInfo.id, undefined);
    });

    test(`Should return error after loading folder info`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.loadFolderInfo('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID', undefined);
    });

    test(`Should redirect to login at 401 error after folder info loading`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.loadFolderInfo();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test('Should return error after request error', async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.loadFolderInfo('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID', undefined);
    });
  });

  describe('loadFolderContent', () => {
    test(`Should successfully load folder content`, async function() {
      expect.assertions(3);

      const folderId = 'folderId';
      const folderContent = [new FolderContentItem(
          'type',
          'id',
          'name',
          'size',
          'folderId',
      )];

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(200, {
              folderContent: [{
                type: folderContent[0].type,
                id: folderContent[0].id,
                name: folderContent[0].name,
                size: folderContent[0].size,
                parentId: folderContent[0].parentId,
              }],
            });
          });

      const apiService = new ApiService();
      await expect(apiService.loadFolderContent(folderId)).resolves.toStrictEqual(folderContent);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith(LOAD_FOLDER_PATH + folderId + '/content', undefined);
    });

    test(`Should return error after loading folder content`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.loadFolderContent('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID/content', undefined);
    });

    test(`Should redirect to login at 401 error after folder content loading`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.loadFolderContent('notID');
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test('Should return error after request error', async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.loadFolderContent('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID/content', undefined);
    });
  });

  describe('searchInFolder', () => {
    test(`Should successfully load folder content with search`, async function() {
      expect.assertions(3);

      const folderId = 'folderId';
      const searchValue = 'searchValue';
      const folderContent = [new FolderContentItem(
          'type',
          'id',
          'name',
          'size',
          'folderId',
      )];

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(200, {
              folderContent: [{
                type: folderContent[0].type,
                id: folderContent[0].id,
                name: folderContent[0].name,
                size: folderContent[0].size,
                parentId: folderContent[0].parentId,
              }],
            });
          });

      const apiService = new ApiService();
      await expect(apiService.searchInFolder(folderId, searchValue)).resolves.toStrictEqual(folderContent);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith(LOAD_FOLDER_PATH + folderId + '/search/'+searchValue, undefined);
    });

    test(`Should return error after loading folder content with search`, async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(405, {});
          });
      const id = 'id';
      const searchValue = 'searchValue';

      const apiService = new ApiService();
      await expect(apiService.searchInFolder(id, searchValue))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith(LOAD_FOLDER_PATH + id+'/search/'+searchValue, undefined);
    });

    test(`Should redirect to login at 401 error after folder content loading with search`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.searchInFolder('notID', 'search...');
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test('Should return error after request error', async function() {
      expect.assertions(3);

      const requestServiceMock = jest
          .spyOn(requestService, 'getJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const id = 'notId';
      const searchValue = 'searchValue';

      const apiService = new ApiService();
      await expect(apiService.searchInFolder(id, searchValue)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith(LOAD_FOLDER_PATH + id+ '/search/'+ searchValue, undefined);
    });
  });

  describe('deleteItem', () => {
    test(`Should successfully delete folder`, async function() {
      expect.assertions(3);

      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService();
      await expect(apiService.deleteItem(item)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folder/'+item.id, undefined);
    });

    test(`Should successfully delete file`, async function() {
      expect.assertions(3);

      const item = {
        type: 'notAFolder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService();
      await expect(apiService.deleteItem(item)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/file/'+item.id, undefined);
    });

    test(`Should return error after deleting folder`, async function() {
      expect.assertions(3);


      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/folder/'+item.id, undefined);
    });

    test(`Should redirect to login at 401 error after folder deleting`, async function() {
      expect.assertions(2);

      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.deleteItem(item);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should return error after deleting file`, async function() {
      expect.assertions(3);


      const item = {
        type: 'notAFolder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, undefined);
    });

    test(`Should return error after deleting folder fetch error`, async function() {
      expect.assertions(3);


      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/folder/'+item.id, undefined);
    });

    test(`Should return error after deleting file fetch error`, async function() {
      expect.assertions(3);


      const item = {
        type: 'notAFolder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, undefined);
    });
  });

  describe('uploadFiles', () => {
    test(`Should successfully upload files`, async function() {
      expect.assertions(3);


      const folderId = 'folderId';

      const requestServiceMock = jest
          .spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const formData = new FormData();
      formData.append('files_0', {});

      const apiService = new ApiService();
      await expect(apiService.uploadFiles(folderId, [{}])).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folders/'+folderId+'/content', formData, undefined);
    });

    test(`Should return error after upload files`, async function() {
      expect.assertions(1);


      jest.spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.uploadFiles('folderId', [])).rejects.toEqual(new ApiServiceError());
    });

    test(`Should redirect to login at 401 error after files uploading`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.uploadFiles('folderId', []);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should return error after upload files fetch error`, async function() {
      expect.assertions(1);


      jest.spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.uploadFiles('folderId', [])).rejects.toEqual(new ApiServiceError());
    });
  });

  describe('renameItem', () => {
    test(`Should successfully rename folder`, async function() {
      expect.assertions(3);


      const item = {
        type: 'folder',
        id: 'itemId',
        name: 'name',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'put')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService();
      await expect(apiService.renameItem(item)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folder/'+item.id, {name: item.name}, undefined);
    });

    test(`Should return error after renaming file`, async function() {
      expect.assertions(3);


      const item = {
        type: 'notAFolder',
        id: 'itemId',
        name: 'name',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'put')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.renameItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, {name: item.name}, undefined);
    });

    test(`Should redirect to login at 401 error after file renaming`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'put')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.renameItem({type: 'file'});
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should return FieldValidationError after renaming file`, async function() {
      expect.assertions(3);


      const item = {
        type: 'notAFolder',
        id: 'itemId',
        name: 'name',
      };
      const error = {errorText: 'error'};

      const requestServiceMock = jest
          .spyOn(requestService, 'put')
          .mockImplementation(async () => {
            return new Response(422, {
              errors: [error],
            });
          });

      const apiService = new ApiService();
      await expect(apiService.renameItem(item)).rejects.toEqual(new FieldValidationError([error]));
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, {name: item.name}, undefined);
    });

    test(`Should return error after renaming folder fetch error`, async function() {
      expect.assertions(3);


      const item = {
        type: 'folder',
        id: 'itemId',
        name: 'name',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'put')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.renameItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/folder/'+item.id, {name: item.name}, undefined);
    });
  });

  describe('createFolder', () => {
    test(`Should successfully send folder creation request`, async function() {
      expect.assertions(3);


      const folder = {
        name: 'name',
        parentId: 'parentId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService();
      await expect(apiService.createFolder(folder)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folders/', folder, undefined);
    });

    test(`Should return error after folder creation request`, async function() {
      expect.assertions(1);


      jest.spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.createFolder({})).rejects.toEqual(new ApiServiceError());
    });

    test(`Should redirect to login at 401 error after folder creation`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.createFolder({});
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should return error after folder creation request fetch error`, async function() {
      expect.assertions(1);


      jest.spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.createFolder({})).rejects.toEqual(new ApiServiceError());
    });
  });

  describe('downloadFile', () => {
    test(`Should successfully download file`, async function() {
      expect.assertions(3);


      const fileId = '123';

      const requestServiceMock = jest
          .spyOn(requestService, 'getBlob')
          .mockImplementation(async () => {
            return new Response(200, {});
          });

      const apiService = new ApiService();

      await expect(apiService.downloadFile(fileId)).resolves.toStrictEqual({});
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/files/'+fileId, undefined);
    });

    test(`Should return error after file downloading request`, async function() {
      expect.assertions(3);


      const requestServiceMock = jest
          .spyOn(requestService, 'getBlob')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService();
      await expect(apiService.downloadFile('fileId')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/files/fileId', undefined);
    });

    test(`Should redirect to login at 401 error after file downloading`, async function() {
      expect.assertions(2);

      const requestServiceMock = jest
          .spyOn(requestService, 'getBlob')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService();
      const redirectMock = jest.fn();
      apiService.redirectToLogin = redirectMock;
      await apiService.downloadFile({});
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(redirectMock).toHaveBeenCalledTimes(1);
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);


      const requestServiceMock = jest
          .spyOn(requestService, 'getBlob')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService();
      await expect(apiService.downloadFile('fileId')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/files/fileId', undefined);
    });
  });
});
