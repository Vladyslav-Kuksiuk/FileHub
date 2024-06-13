import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {clearRegistry, registry} from '../../../src/registry.js';

describe('LoadFolderContentAction', () => {
  let apiService;

  beforeEach(()=>{
    clearRegistry();
    apiService = {
      loadFolderContent: () => {},
    };

    registry.register('apiService', () => {
      return apiService;
    });
  });

  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(5);

    const apiServiceMock = jest
        .spyOn(apiService, 'loadFolderContent')
        .mockImplementation(async ()=>{
          return {};
        });

    const action = new LoadFolderContentAction('id');

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_FOLDER_CONTENT, {});
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, false);
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function() {
    expect.assertions(5);

    const error = 'testError';

    const apiServiceMock = jest
        .spyOn(apiService, 'loadFolderContent')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });

    const action = new LoadFolderContentAction('id');

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_FOLDER_CONTENT_ERROR, error);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_FOLDER_CONTENT_LOADING, false);
    });
  });
});
