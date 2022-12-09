import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {registry, clearRegistry} from '../../../src/registry';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {UploadFilesAction} from '../../../src/state-management/folder/upload-files-action';

describe('UploadFilesAction', () => {
  let apiService;
  let stateManagementService;

  beforeEach(()=>{
    clearRegistry();

    apiService = {
      uploadFiles: () => {},
    };
    stateManagementService = new StateManagementService({}, {});

    registry.register('apiService', () => {
      return apiService;
    });

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });
  });

  test(`Should return expected successfully sequence of mutator calls with LoadFolderContent`, function() {
    expect.assertions(6);
    const folderId = 'id';

    const apiServiceMock = jest
        .spyOn(apiService, 'uploadFiles')
        .mockImplementation(async ()=>{});

    const dispatchActionMock = jest
        .spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});

    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            folderInfo: {
              id: folderId,
            },
          };
        });

    const action = new UploadFilesAction(folderId, {});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(2);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD, folderId);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD, folderId);
      expect(dispatchActionMock).toHaveBeenCalledTimes(1);
      expect(dispatchActionMock).toHaveBeenCalledWith(
          new LoadFolderContentAction('123'));
    });
  });

  test(`Should return expected successfully sequence of mutator calls without LoadFolderContent`, function() {
    expect.assertions(5);
    const folderId = 'id';

    const apiServiceMock = jest
        .spyOn(apiService, 'uploadFiles')
        .mockImplementation(async ()=>{});

    const dispatchActionMock = jest
        .spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});

    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            folderInfo: {
              id: 'notId',
            },
          };
        });

    const action = new UploadFilesAction(folderId, {});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(2);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD, folderId);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD, folderId);
      expect(dispatchActionMock).toHaveBeenCalledTimes(0);
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function() {
    expect.assertions(5);
    const folderId = 'id';
    const error = 'error';

    const apiServiceMock = jest
        .spyOn(apiService, 'uploadFiles')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });
    const action = new UploadFilesAction(folderId, {});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.ADD_FOLDER_TO_UPLOAD, folderId);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.ADD_FILES_UPLOADING_ERROR_INFO, {
        error: error,
        folderId: folderId,
      });
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.REMOVE_FOLDER_TO_UPLOAD, folderId);
    });
  });
});
