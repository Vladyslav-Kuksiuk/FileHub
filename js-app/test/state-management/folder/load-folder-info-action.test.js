import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {jest} from '@jest/globals';
import {ApplicationContext} from '../../../src/application-context';
import {STATE, FOLDER_INFO} from '../../../src/state-management/state';

describe('LoadFolderInfoAction', () => {
  let applicationContext;

  beforeEach(()=>{
    applicationContext = new ApplicationContext();
  });

  test(`Should return expected successfully sequence of mutator calls`, function(done) {
    expect.assertions(3);

    const folderInfo = {
      [FOLDER_INFO.NAME]: 'folder',
      [FOLDER_INFO.PARENT_ID]: 'parentId',
      [FOLDER_INFO.ITEMS_AMOUNT]: 1,
      [FOLDER_INFO.ID]: 'ID',
    };
    const mutatorCallStack = [];
    const expectedStack = [
      {mutator: MUTATOR_NAMES.SET_FOLDER_INFO, payload: null},
      {mutator: MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, payload: null},
      {mutator: MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, payload: true},
      {mutator: MUTATOR_NAMES.SET_FOLDER_INFO, payload: folderInfo},
      {mutator: MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, payload: false},
    ];

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'loadFolderInfo')
        .mockImplementation(async ()=>{
          return {[STATE.FOLDER_INFO]: folderInfo};
        });

    const action = new LoadFolderInfoAction(folderInfo[FOLDER_INFO.ID]);

    const executor = jest.fn((mutator, payload)=>{
      mutatorCallStack.push({mutator, payload});
    });

    action.execute(executor, applicationContext);

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(executor).toBeCalledTimes(5);
      expect(mutatorCallStack).toStrictEqual(expectedStack);
      done();
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function(done) {
    expect.assertions(3);

    const error = 'testError';
    const mutatorCallStack = [];
    const expectedStack = [
      {mutator: MUTATOR_NAMES.SET_FOLDER_INFO, payload: null},
      {mutator: MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, payload: null},
      {mutator: MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, payload: true},
      {mutator: MUTATOR_NAMES.SET_FOLDER_INFO_ERROR, payload: error},
      {mutator: MUTATOR_NAMES.SET_IS_FOLDER_INFO_LOADING, payload: false},
    ];

    const apiServiceMock = jest
        .spyOn(applicationContext.apiService, 'loadFolderInfo')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });

    const action = new LoadFolderInfoAction();

    const executor = jest.fn((mutator, payload)=>{
      mutatorCallStack.push({mutator, payload});
    });

    action.execute(executor, applicationContext);

    setTimeout(()=>{
      expect(apiServiceMock).toBeCalledTimes(1);
      expect(executor).toBeCalledTimes(5);
      expect(mutatorCallStack).toStrictEqual(expectedStack);
      done();
    });
  });
});
