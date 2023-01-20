import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {registry, clearRegistry} from '../../../src/registry';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {CreateFolderAction} from '../../../src/state-management/folder/create-folder-action';

describe('CreateFolderAction', () => {
  let apiService;
  let stateManagementService;

  beforeEach(()=>{
    clearRegistry();

    apiService = {
      createFolder: ()=>{},
    };
    stateManagementService = new StateManagementService({}, {});

    registry.register('apiService', () => {
      return apiService;
    });

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });
  });

  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(7);

    const apiServiceMock = jest
        .spyOn(apiService, 'createFolder')
        .mockImplementation(async ()=>{});

    const dispatchActionMock = jest
        .spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});

    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            folderInfo: {
              id: '123',
            },
          };
        });

    const action = new CreateFolderAction({});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE, {});
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_IS_FOLDER_CREATION_MODAL_OPEN, false);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE, null);
      expect(dispatchActionMock).toHaveBeenCalledTimes(1);
      expect(dispatchActionMock).toHaveBeenCalledWith(
          new LoadFolderContentAction('123'));
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function() {
    expect.assertions(5);

    const apiServiceMock = jest
        .spyOn(apiService, 'createFolder')
        .mockImplementation(async ()=>{
          throw new Error('error');
        });

    const action = new CreateFolderAction({});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE, {});
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_FOLDER_CREATION_ERROR, 'error');
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_FOLDER_IN_CREATION_STATE, null);
    });
  });
});
