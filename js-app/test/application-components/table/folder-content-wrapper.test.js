import {ApplicationContext} from '../../../src/application-context';
import {FolderContentWrapper} from '../../../src/application-components/table/folder-content-wrapper';
import {FolderContent} from '../../../src/components/folder-content';
import {jest} from '@jest/globals';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';

describe('FolderContentWrapper', () => {
  let applicationContext;
  let stateListeners = {};
  let dispatchMock;
  let addStateListenerMock;

  beforeEach(() => {
    applicationContext = new ApplicationContext();

    stateListeners = {};
    addStateListenerMock = jest.spyOn(applicationContext.stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
          return {
            field: field,
            listener: listener,
          };
        });
    dispatchMock = jest.spyOn(applicationContext.stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test('Should add folderInfo state listeners', function() {
    expect.assertions(2);
    new FolderContentWrapper(applicationContext);

    expect(addStateListenerMock).toHaveBeenCalledTimes(1);
    expect(addStateListenerMock.mock.calls[0][0]).toBe('folderInfo');
  });

  test('Should dispatch LoadFolderContentAction', function() {
    expect.assertions(2);
    new FolderContentWrapper(applicationContext);

    stateListeners['folderInfo']({
      folderInfo: {
        id: '123',
      },
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock)
        .toHaveBeenCalledWith(new LoadFolderContentAction('123', applicationContext.apiService));
  });

  test(`Should add state listeners`, function() {
    expect.assertions(11);

    const wrapper = new FolderContentWrapper(applicationContext);
    const folderContent = new FolderContent(document.body, false, false, [], []);

    const isLoadingMock = jest.spyOn(folderContent, 'isLoading', 'set').mockImplementation(()=>{});
    const hasErrorMock = jest.spyOn(folderContent, 'hasError', 'set').mockImplementation(()=>{});
    const contentMock = jest.spyOn(folderContent, 'setContent').mockImplementation(()=>{});

    wrapper.wrap(folderContent);
    expect(Object.keys(stateListeners)).toContain('isFolderContentLoading');
    expect(Object.keys(stateListeners)).toContain('isUserProfileLoading');
    expect(Object.keys(stateListeners)).toContain('isFolderInfoLoading');
    expect(Object.keys(stateListeners)).toContain('folderContent');
    expect(Object.keys(stateListeners)).toContain('folderContentError');

    const folderContentState = {
      folderContent: [
        {type: 'folder'},
        {type: 'notAFolder'}],
    };

    stateListeners.isFolderContentLoading({
      isFolderContentLoading: false,
    });
    stateListeners.isUserProfileLoading({
      isUserProfileLoading: true,
    });
    stateListeners.isFolderInfoLoading({
      isFolderInfoLoading: true,
    });
    stateListeners.folderContent({});
    stateListeners.folderContent(folderContentState);
    stateListeners.folderContentError({
      folderContentError: 'error',
    });

    expect(isLoadingMock).toHaveBeenCalledTimes(3);
    expect(isLoadingMock).toHaveBeenCalledWith(false);
    expect(isLoadingMock).toHaveBeenCalledWith(true);
    expect(hasErrorMock).toHaveBeenCalledTimes(1);
    expect(hasErrorMock).toHaveBeenCalledWith(true);
    expect(contentMock).toHaveBeenCalledTimes(2);
  });

  test('Should remove state listeners', function() {
    expect.assertions(1);
    const folderContentWrapper = new FolderContentWrapper(applicationContext);

    const removeStateListenersMock = jest.spyOn(
        applicationContext.stateManagementService,
        'removeStateListener')
        .mockImplementation(()=>{});

    folderContentWrapper.removeStateListeners();

    expect(removeStateListenersMock.mock.calls[0][0]).toBe('folderInfo');
  });

  test('Should trigger onNavigateToFolder listener', function() {
    expect.assertions(2);

    const folderContentWrapper = new FolderContentWrapper(applicationContext);
    const folderContent = [{
      type: 'folder',
      name: 'myFolder',
      id: '123',
    }];

    let folders;
    const setContentMock = jest.fn().mockImplementation((items)=>{
      folders = items;
    });

    const navigateListenerMock = jest.fn();
    folderContentWrapper.wrap({
      setContent: setContentMock,
    });
    folderContentWrapper.onNavigateToFolder(navigateListenerMock);

    stateListeners['folderContent']({
      folderContent: folderContent,
    });

    folders[0].linkListener();

    expect(navigateListenerMock).toHaveBeenCalledTimes(1);
    expect(navigateListenerMock)
        .toHaveBeenCalledWith(folderContent[0].id);
  });
});