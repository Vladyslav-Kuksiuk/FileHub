import {RequestService} from '../../src/server-connection/request-service';
import {Response} from '../../src/server-connection/response';
import {
  ApiService,
  LOGIN_401_ERROR,
  LOG_IN_USER_PATH,
  REGISTER_USER_PATH,
  LOG_OUT_USER_PATH,
  LOAD_USER_PATH,
  LOAD_FOLDER_PATH,
} from '../../src/server-connection/api-service';
import {DEFAULT_ERROR} from '../../src/server-connection/api-service-error';
import {UserData} from '../../src/user-data';
import {jest} from '@jest/globals';
import {ApiServiceError} from '../../src/server-connection/api-service-error';
import {FieldValidationError} from '../../src/server-connection/field-validation-error';
import {FolderInfo} from '../../src/state-management/folder/folder-info.js';
import {UserProfile} from '../../src/state-management/user/user-profile.js';
import {FolderContentItem} from '../../src/state-management/folder/folder-content-item';

describe('ApiService', () => {
  const login = 'login';
  const password = 'password';

  describe('logIn', () => {
    test(`Should successfully log in`, async function() {
      expect.assertions(3);

      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async (url, body) => {
            return new Response(200, {token: 'myToken'});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logIn(new UserData(login, password))).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {username: login, password: password});
    });

    test(`Should return error after login with error message ${DEFAULT_ERROR}`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(400, {});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logIn(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {username: login, password: password});
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logIn(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {username: login, password: password});
    });

    test(`Should return error after login with error message ${LOGIN_401_ERROR}`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(401, {});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logIn(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError(LOGIN_401_ERROR));
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_IN_USER_PATH, {username: login, password: password});
    });
  });

  describe('register', () => {
    test(`Should successfully register`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(200, {token: 'myToken'});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.register(new UserData(login, password))).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH, {username: login, password: password});
    });

    test(`Should return error after registration with error message ${DEFAULT_ERROR}`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(400, {});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.register(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH, {username: login, password: password});
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.register(new UserData(login, password)))
          .rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH, {username: login, password: password});
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

      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(422, {errors: errors});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.register(new UserData('login', 'password')))
          .rejects.toEqual(new FieldValidationError(errors));
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(REGISTER_USER_PATH,
          {username: login, password: password});
    });
  });

  describe('logOut', () => {
    test(`Should successfully log out`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            return new Response(200, {});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logOut()).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_OUT_USER_PATH, undefined);
    });

    test(`Should return error after log out`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logOut()).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_OUT_USER_PATH, undefined);
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.logOut()).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOG_OUT_USER_PATH, undefined);
    });
  });

  describe('loadUser', () => {
    test(`Should successfully load user`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const userProfile = new UserProfile(
          'testUser',
          'rootFolder',
      );

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            return new Response(200, {
              userProfile: {
                username: userProfile.username,
                rootFolderId: userProfile.rootFolderId,
              },
            });
          });

      const apiService = new ApiService(requestService);

      await expect(apiService.loadUser()).resolves.toStrictEqual(userProfile);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_USER_PATH, undefined);
    });

    test(`Should return error after user loading`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.loadUser()).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_USER_PATH, undefined);
    });

    test(`Should return error after request error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.loadUser()).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_USER_PATH, undefined);
    });
  });

  describe('loadFolderInfo', () => {
    test(`Should successfully load folder info`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const folderInfo = new FolderInfo(
          'folderName',
          'folderId',
          'parentId',
          10,
      );

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
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

      const apiService = new ApiService(requestService);
      await expect(apiService.loadFolderInfo(folderInfo.id)).resolves.toStrictEqual(folderInfo);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + folderInfo.id, undefined);
    });

    test(`Should return error after loading folder info`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.loadFolderInfo('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID', undefined);
    });

    test('Should return error after request error', async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.loadFolderInfo('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID', undefined);
    });
  });

  describe('loadFolderContent', () => {
    test(`Should successfully load folder content`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const folderId = 'folderId';
      const folderContent = [new FolderContentItem(
          'type',
          'id',
          'name',
          'size',
          'folderId',
      )];

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
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

      const apiService = new ApiService(requestService);
      await expect(apiService.loadFolderContent(folderId)).resolves.toStrictEqual(folderContent);
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith(LOAD_FOLDER_PATH + folderId + '/content', undefined);
    });

    test(`Should return error after loading folder content`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.loadFolderContent('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID/content', undefined);
    });

    test('Should return error after request error', async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const requestServiceMock = jest
          .spyOn(requestService, 'get')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.loadFolderContent('notID')).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith(LOAD_FOLDER_PATH + 'notID/content', undefined);
    });
  });

  describe('deleteItem', () => {
    test(`Should successfully delete folder`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.deleteItem(item)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folder/'+item.id, undefined);
    });

    test(`Should successfully delete file`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const item = {
        type: 'notAFolder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.deleteItem(item)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/file/'+item.id, undefined);
    });

    test(`Should return error after deleting folder`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/folder/'+item.id, undefined);
    });

    test(`Should return error after deleting file`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const item = {
        type: 'notAFolder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, undefined);
    });

    test(`Should return error after deleting folder fetch error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const item = {
        type: 'folder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/folder/'+item.id, undefined);
    });

    test(`Should return error after deleting file fetch error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const item = {
        type: 'notAFolder',
        id: 'itemId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'delete')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.deleteItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, undefined);
    });
  });

  describe('uploadFiles', () => {
    test(`Should successfully upload files`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const folderId = 'folderId';

      const requestServiceMock = jest
          .spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const formData = new FormData();
      formData.append('files_0', {});

      const apiService = new ApiService(requestService);
      await expect(apiService.uploadFiles(folderId, [{}])).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folders/'+folderId+'/content', formData, undefined);
    });

    test(`Should return error after upload files`, async function() {
      expect.assertions(1);
      const requestService = new RequestService();

      jest.spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.uploadFiles('folderId', [])).rejects.toEqual(new ApiServiceError());
    });

    test(`Should return error after upload files fetch error`, async function() {
      expect.assertions(1);
      const requestService = new RequestService();

      jest.spyOn(requestService, 'postFormData')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.uploadFiles('folderId', [])).rejects.toEqual(new ApiServiceError());
    });
  });

  describe('renameItem', () => {
    test(`Should successfully rename folder`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

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

      const apiService = new ApiService(requestService);
      await expect(apiService.renameItem(item)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folder/'+item.id, {name: item.name}, undefined);
    });

    test(`Should return error after renaming file`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

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

      const apiService = new ApiService(requestService);
      await expect(apiService.renameItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, {name: item.name}, undefined);
    });

    test(`Should return FieldValidationError after renaming file`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

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

      const apiService = new ApiService(requestService);
      await expect(apiService.renameItem(item)).rejects.toEqual(new FieldValidationError([error]));
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/file/'+item.id, {name: item.name}, undefined);
    });

    test(`Should return error after renaming folder fetch error`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

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

      const apiService = new ApiService(requestService);
      await expect(apiService.renameItem(item)).rejects.toEqual(new ApiServiceError());
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock).toHaveBeenCalledWith('api/folder/'+item.id, {name: item.name}, undefined);
    });
  });

  describe('createFolder', () => {
    test(`Should successfully send folder creation request`, async function() {
      expect.assertions(3);
      const requestService = new RequestService();

      const folder = {
        name: 'name',
        parentId: 'parentId',
      };

      const requestServiceMock = jest
          .spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(200);
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.createFolder(folder)).resolves.toBeUndefined();
      await expect(requestServiceMock).toHaveBeenCalledTimes(1);
      await expect(requestServiceMock)
          .toHaveBeenCalledWith('api/folders/', folder, undefined);
    });

    test(`Should return error after folder creation request`, async function() {
      expect.assertions(1);
      const requestService = new RequestService();

      jest.spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            return new Response(405, {});
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.createFolder({})).rejects.toEqual(new ApiServiceError());
    });

    test(`Should return error after folder creation request fetch error`, async function() {
      expect.assertions(1);
      const requestService = new RequestService();

      jest.spyOn(requestService, 'postJson')
          .mockImplementation(async () => {
            throw new Error();
          });

      const apiService = new ApiService(requestService);
      await expect(apiService.createFolder({})).rejects.toEqual(new ApiServiceError());
    });
  });
});
