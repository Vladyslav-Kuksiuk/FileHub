import {FileListWrapper} from '../../../src/application-components/table/file-list-wrapper';
import {FileList} from '../../../src/components/file-list';
import {jest} from '@jest/globals';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {registry, clearRegistry} from '../../../src/registry';
import {DefineRemovingItemAction} from '../../../src/state-management/folder/define-removing-item-action';
import {UploadFilesAction} from '../../../src/state-management/folder/upload-files-action';

describe('FileListWrapper', () => {
  let stateManagementService;
  let stateListeners = {};
  let dispatchMock;
  let addStateListenerMock;

  beforeEach(() => {
    document.body.innerHTML = '';
    clearRegistry();
    stateListeners = {};
    stateManagementService = new StateManagementService({}, {});

    addStateListenerMock = jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
          return {
            field: field,
            listener: listener,
          };
        });

    dispatchMock = jest.spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});

    jest.spyOn(stateManagementService, 'removeStateListener')
        .mockImplementation(()=>{});

    registry.register('stateManagementService', ()=>{
      return stateManagementService;
    });

    registry.register('apiService', ()=>{
      return {};
    });

    registry.register('fileTypeIconFactory', ()=>{
      return {
        getIcon: ()=>{},
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
    stateListeners.folderInfo({
      folderInfo: null,
    });

    expect(isLoadingMock).toHaveBeenCalledTimes(3);
    expect(isLoadingMock).toHaveBeenCalledWith(false);
    expect(isLoadingMock).toHaveBeenCalledWith(true);
    expect(hasErrorMock).toHaveBeenCalledTimes(1);
    expect(hasErrorMock).toHaveBeenCalledWith(true);
    expect(contentMock).toHaveBeenCalledTimes(2);
  });

  test('Should render folder row and trigger navigation and removing events', () => {
    expect.assertions(3);

    const wrapper = new FileListWrapper();
    let folderCreator;
    const setContentMock = jest.fn((folderCreators) => {
      folderCreator = folderCreators[0];
    });

    const navigateListenerMock = jest.fn();

    wrapper.wrap({
      setContent: setContentMock,
    });
    wrapper.onNavigateToFolder(navigateListenerMock);

    const folder = {
      type: 'folder',
      name: 'name',
      id: 'id',
    };

    stateListeners.folderContent({
      folderContent: [
        folder,
      ],
    });

    folderCreator(document.body);

    document.body.querySelector('[data-td="remove-button"]').click();
    document.body.querySelector('[data-td="folder-link-slot"] a').click();

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith( new DefineRemovingItemAction(folder));
    expect(navigateListenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should render folder row and trigger uploading events', () => {
    expect.assertions(4);

    const wrapper = new FileListWrapper();
    let folderCreator;
    const setContentMock = jest.fn((folderCreators) => {
      folderCreator = folderCreators[0];
    });

    const navigateListenerMock = jest.fn();

    wrapper.wrap({
      setContent: setContentMock,
    });
    wrapper.onNavigateToFolder(navigateListenerMock);

    const folder = {
      type: 'folder',
      name: 'name',
      id: 'id',
    };

    stateListeners.folderContent({
      folderContent: [
        folder,
      ],
    });

    folderCreator(document.body);

    stateListeners.foldersToUpload({
      foldersToUpload: [folder.id],
    });
    expect(document.body.querySelector('[data-td="upload-button"]').title).toBe('File uploading...');

    stateListeners.filesUploadingErrorInfo({
      filesUploadingErrorInfo: {},
    });
    stateListeners.filesUploadingErrorInfo({
      filesUploadingErrorInfo: {
        [folder.id]: 'error',
      },
    });
    expect(document.body.querySelector('[data-td="upload-button"]').title).toBe('error');

    const createElementSpy = jest.spyOn(document, 'createElement');
    document.body.querySelector('[data-td="upload-button"]').click();
    const input = createElementSpy.mock.results[0].value;
    input.dispatchEvent(new Event('change'));

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new UploadFilesAction(folder.id, input.files));
  });

  test('Should render file row and trigger events', () => {
    expect.assertions(2);

    const wrapper = new FileListWrapper();
    let fileCreator;
    const setContentMock = jest.fn((folderCreators, fileCreators) => {
      fileCreator = fileCreators[0];
    });

    wrapper.wrap({
      setContent: setContentMock,
    });

    const file = {
      type: 'mp3',
      name: 'name',
      id: 'id',
    };

    stateListeners.folderContent({
      folderContent: [
        file,
      ],
    });

    fileCreator(document.body);

    document.body.querySelector('[data-td="remove-button"]').click();

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith( new DefineRemovingItemAction(file));
  });
});
