import {StateManagementService} from '../../../src/state-management/state-management-service';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {FolderContentWrapper} from '../../../src/application-components/table/folder-content-wrapper';
import {FolderContent} from '../../../src/components/folder-content';
import {jest} from '@jest/globals';

describe('FolderContentWrapper', () => {
  let stateManagementService;
  let stateListeners = {};
  let dispatchMock;

  beforeEach(() => {
    stateManagementService = new StateManagementService({}, {}, {});

    stateListeners = {};
    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
        });
    dispatchMock = jest.spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should dispatch LoadUserAction, LoadFolderInfoAction, LoadFolderContentAction`, function() {
    expect.assertions(4);

    new FolderContentWrapper(stateManagementService);

    stateListeners.userProfile?.({userProfile: {rootFolderId: 'root'}});
    stateListeners.folderInfo?.({folderInfo: {id: 'folder'}});
    expect(dispatchMock).toHaveBeenCalledTimes(3);
    expect(dispatchMock).toHaveBeenCalledWith(new LoadUserAction);
    expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction('root'));
    expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderContentAction('folder'));
  });

  test(`Should add state listeners`, function() {
    expect.assertions(6);

    const wrapper = new FolderContentWrapper(stateManagementService);
    const folderContent = new FolderContent(document.body, false, false, [], []);

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
