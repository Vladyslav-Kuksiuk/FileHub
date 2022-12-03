import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {jest} from '@jest/globals';
import {FolderInfo} from '../../../src/state-management/folder/folder-info';
import {ApiService} from '../../../src/server-connection/api-service.js';
import {clearRegistry, registry} from '../../../src/registry.js';

describe('LoadFolderInfoAction', () => {
  let apiService;

  beforeEach(()=>{
    clearRegistry();
    apiService = new ApiService({});

    registry.register('apiService', () => {
      return apiService;
    });
  });

  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(5);

    const folderInfo = new FolderInfo(
        'folder',
        'ID',
        'parentId',
        1,
    );

    const apiServiceMock = jest
        .spyOn(apiService, 'loadFolderInfo')
        .mockImplementation(async ()=>{
          return folderInfo;
        });

    const action = new LoadFolderInfoAction(folderInfo.id);

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_FOLDER_INFO, folderInfo);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, false);
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function() {
    expect.assertions(5);

    const error = 'testError';

    const apiServiceMock = jest
        .spyOn(apiService, 'loadFolderInfo')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });

    const action = new LoadFolderInfoAction('id');

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, error);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, false);
    });
  });
});
