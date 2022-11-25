import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {DeleteItemAction} from '../../../src/state-management/folder/delete-item-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';

describe('DeleteItemAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
  });

  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(7);

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'deleteItem')
        .mockImplementation(async ()=>{});

    const dispatchActionMock = jest
        .spyOn(applicationContext.stateManagementService, 'dispatch')
        .mockImplementation(()=>{});

    jest.spyOn(applicationContext.stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            folderInfo: {
              id: '123',
            },
          };
        });

    const action = new DeleteItemAction({}, applicationContext.apiService);

    const executor = jest.fn(()=>{});

    return action.execute(executor, applicationContext.stateManagementService).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_ITEM_DELETING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_REMOVING_ITEM, null);
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_ITEM_DELETING, false);
      expect(dispatchActionMock).toHaveBeenCalledTimes(1);
      expect(dispatchActionMock).toHaveBeenCalledWith(
          new LoadFolderContentAction('123', applicationContext.apiService));
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function() {
    expect.assertions(5);

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'deleteItem')
        .mockImplementation(async ()=>{
          throw new Error('error');
        });

    const action = new DeleteItemAction({}, applicationContext.apiService);

    const executor = jest.fn(()=>{});

    return action.execute(executor, applicationContext.stateManagementService).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.SET_IS_ITEM_DELETING, true);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.SET_ITEM_DELETING_ERROR, 'error');
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.SET_IS_ITEM_DELETING, false);
    });
  });
});
