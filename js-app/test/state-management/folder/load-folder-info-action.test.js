import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-components/application-context';
import {FolderInfo} from '../../../src/state-management/folder/folder-info';

describe('LoadFolderInfoAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
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
        .spyOn(applicationContext.apiService, 'loadFolderInfo')
        .mockImplementation(async ()=>{
          return folderInfo;
        });

    const action = new LoadFolderInfoAction(folderInfo.id, applicationContext.apiService);

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
        .spyOn(applicationContext.apiService, 'loadFolderInfo')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });

    const action = new LoadFolderInfoAction('id', applicationContext.apiService);

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
