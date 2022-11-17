import {ApplicationContext} from '../../../src/application-context';
import {FolderContentWrapper} from '../../../src/application-components/table/folder-content-wrapper';
import {FolderContent} from '../../../src/components/folder-content';
import {jest} from '@jest/globals';

describe('FolderContentWrapper', () => {
  let applicationContext;
  let stateListeners = {};

  beforeEach(() => {
    applicationContext = new ApplicationContext();

    stateListeners = {};
    jest.spyOn(applicationContext.stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
        });
    jest.spyOn(applicationContext.stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should add state listeners`, function() {
    expect.assertions(6);

    const wrapper = new FolderContentWrapper(applicationContext);
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
