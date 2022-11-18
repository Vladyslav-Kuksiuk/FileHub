import {ApplicationContext} from '../../../src/application-context';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {FileListWrapper} from '../../../src/application-components/table/file-list-wrapper.js';
import {FileList} from '../../../src/components/file-list';
import {jest} from '@jest/globals';

describe('FileListWrapper', () => {
  let applicationContext;
  let stateListeners = {};
  let dispatchMock;

  beforeEach(() => {
    applicationContext = new ApplicationContext();

    stateListeners = {};
    jest.spyOn(applicationContext.stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
        });
    dispatchMock = jest.spyOn(applicationContext.stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should dispatch LoadUserAction, LoadFolderInfoAction, LoadFolderContentAction`, function() {
    expect.assertions(4);

    new FileListWrapper(applicationContext);

    stateListeners.userProfile?.({
      userProfile: {rootFolderId: 'root',
      }});

    stateListeners.folderInfo?.({
      userProfile: {rootFolderId: 'root'},
      folderInfo: {id: 'folder'}});

    expect(dispatchMock).toHaveBeenCalledTimes(3);
    expect(dispatchMock).toHaveBeenCalledWith(new LoadUserAction(applicationContext.apiService));
    expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction('root', applicationContext.apiService));
    expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderContentAction('folder', applicationContext.apiService));
  });

  test(`Should add state listeners`, function() {
    expect.assertions(6);

    const wrapper = new FileListWrapper(applicationContext);
    const folderContent = new FileList(document.body, false, false, [], []);

    const isLoadingMock = jest.spyOn(folderContent, 'isLoading', 'set').mockImplementation(()=>{});
    const hasErrorMock = jest.spyOn(folderContent, 'hasError', 'set').mockImplementation(()=>{});
    const contentMock = jest.spyOn(folderContent, 'setContent').mockImplementation(()=>{});

    wrapper.wrap(folderContent);
    expect(Object.keys(stateListeners)).toContain('isFolderContentLoading');
    expect(Object.keys(stateListeners)).toContain('folderContent');
    expect(Object.keys(stateListeners)).toContain('folderContentError');

    const userProfileState = {
      folderContent: [
        {type: 'folder'},
        {type: 'notAFolder'}],
    };

    stateListeners.isFolderContentLoading?.({});
    stateListeners.folderContent?.(userProfileState);
    stateListeners.folderContent?.({});
    stateListeners.folderContentError?.({});

    expect(isLoadingMock).toHaveBeenCalledTimes(1);
    expect(hasErrorMock).toHaveBeenCalledTimes(1);
    expect(contentMock).toHaveBeenCalledTimes(2);
  });
});
