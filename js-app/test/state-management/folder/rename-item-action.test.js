import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {RenameItemAction} from '../../../src/state-management/folder/rename-item-action';
import {jest} from '@jest/globals';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {registry, clearRegistry} from '../../../src/registry';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {FieldValidationError} from '../../../src/server-connection/field-validation-error';

describe('RenameItemAction', () => {
  let apiService;
  let stateManagementService;

  beforeEach(()=>{
    clearRegistry();

    apiService = {
      renameItem: () => {},
    };
    stateManagementService = new StateManagementService({}, {});

    registry.register('apiService', () => {
      return apiService;
    });

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });
  });

  test(`Should return expected successfully sequence of mutator calls with LoadFolderContentAction dispatching`,
      function() {
        expect.assertions(7);

        const folderId = '123';

        const apiServiceMock = jest
            .spyOn(apiService, 'renameItem')
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

        const action = new RenameItemAction({
          parentId: folderId,
        });

        const executor = jest.fn(()=>{});

        return action.execute(executor).then(()=>{
          expect(apiServiceMock).toHaveBeenCalledTimes(1);
          expect(executor).toHaveBeenCalledTimes(3);
          expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);
          expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_RENAMING_ITEM, {
            parentId: folderId,
          });
          expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_RENAMING_ITEM, null);
          expect(dispatchActionMock).toHaveBeenCalledTimes(1);
          expect(dispatchActionMock).toHaveBeenCalledWith(
              new LoadFolderContentAction(folderId));
        });
      });

  test(`Should return expected successfully sequence of mutator calls without LoadFolderContentAction dispatching`,
      function() {
        expect.assertions(6);

        const folderId = '123';

        const apiServiceMock = jest
            .spyOn(apiService, 'renameItem')
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

        const action = new RenameItemAction({
          parentId: folderId,
        });

        const executor = jest.fn(()=>{});

        return action.execute(executor).then(()=>{
          expect(apiServiceMock).toHaveBeenCalledTimes(1);
          expect(executor).toHaveBeenCalledTimes(3);
          expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);
          expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_RENAMING_ITEM, {
            parentId: folderId,
          });
          expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_RENAMING_ITEM, null);
          expect(dispatchActionMock).toHaveBeenCalledTimes(0);
        });
      });

  test(`Should return expected failed sequence of mutator calls with ApiServiceError`, function() {
    expect.assertions(5);

    const apiServiceMock = jest
        .spyOn(apiService, 'renameItem')
        .mockImplementation(async ()=>{
          throw new Error('error');
        });

    const action = new RenameItemAction({});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_RENAMING_ITEM, {});
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS, ['error']);
    });
  });

  test(`Should return expected failed sequence of mutator calls with FieldValidationError`, function() {
    expect.assertions(5);

    const error = {errorText: 'errorText'};

    const apiServiceMock = jest
        .spyOn(apiService, 'renameItem')
        .mockImplementation(async ()=>{
          throw new FieldValidationError([error]);
        });

    const action = new RenameItemAction({});

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_ITEM_RENAMING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_RENAMING_ITEM, {});
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_ITEM_RENAMING_ERRORS, [error.errorText]);
    });
  });
});
