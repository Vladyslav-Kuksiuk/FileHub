import {FileListWrapper} from '../../../src/application-components/table/file-list-wrapper';
import {FileList} from '../../../src/components/file-list';
import {jest} from '@jest/globals';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {registry, clearRegistry} from '../../../src/registry';

describe('FileListWrapper', () => {
  let stateListeners = {};
  let dispatchMock;
  let addStateListenerMock;
  let removeStateListenerMock;

  beforeEach(() => {
    clearRegistry();
    stateListeners = {};
    addStateListenerMock = jest.fn((field, listener)=>{
      stateListeners[field] = listener;
      return {
        field: field,
        listener: listener,
      };
    });

    dispatchMock = jest.fn();

    removeStateListenerMock = jest.fn();

    registry.register('stateManagementService', ()=>{
      return {
        addStateListener: addStateListenerMock,
        dispatch: dispatchMock,
        removeStateListener: removeStateListenerMock,
      };
    });
  });

  test('Should add folderInfo state listeners', function() {
    expect.assertions(2);
    new FileListWrapper();

    expect(addStateListenerMock).toHaveBeenCalledTimes(1);
    expect(addStateListenerMock.mock.calls[0][0]).toBe('folderInfo');
  });

  test('Should dispatch LoadFolderContentAction', function() {
    expect.assertions(2);
    registry.register('apiService', ()=> {
      return {};
    });

    new FileListWrapper();

    stateListeners['folderInfo']({
      folderInfo: {
        id: '123',
      },
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock)
        .toHaveBeenCalledWith(new LoadFolderContentAction('123'));
  });

  test(`Should add state listeners`, function() {
    expect.assertions(11);

    registry.register('fileTypeIconFactory', ()=>{
      return {
        getIcon: ()=>{},
      };
    });

    const wrapper = new FileListWrapper();
    const folderContent = new FileList(document.body, false, false, [], []);

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
    stateListeners.isUserProfileLoading({
      isUserProfileLoading: false,
    });
    stateListeners.isFolderInfoLoading({
      isFolderInfoLoading: true,
    });
    stateListeners.isFolderInfoLoading({
      isFolderInfoLoading: false,
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
});
