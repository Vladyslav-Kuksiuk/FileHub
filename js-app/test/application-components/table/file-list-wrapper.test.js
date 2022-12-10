import {FileListWrapper} from '../../../src/application-components/table/file-list-wrapper';
import {FileList} from '../../../src/components/file-list';
import {jest} from '@jest/globals';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {LoadFolderContentAction} from '../../../src/state-management/folder/load-folder-content-action';
import {registry, clearRegistry} from '../../../src/registry';
import {DefineRemovingItemAction} from '../../../src/state-management/folder/define-removing-item-action';
import {UploadFilesAction} from '../../../src/state-management/folder/upload-files-action';
import {DefineRenamingItemAction} from '../../../src/state-management/folder/define-renaming-item-action';
import {RenameItemAction} from '../../../src/state-management/folder/rename-item-action';
import {DownloadFileAction} from '../../../src/state-management/folder/download-file-action';

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

    registry.register('downloadService', ()=>{
      return {};
    });

    registry.register('fileTypeFactory', ()=>{
      return {
        getType: ()=>{},
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

    registry.register('fileTypeFactory', ()=>{
      return {
        getType: ()=>{},
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

  test('Should render folder row and trigger renaming state events', () => {
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

    stateListeners.renamingItem({
      renamingItem: {
        id: 'notId',
      },
    });
    stateListeners.renamingItem({
      renamingItem: folder,
    });
    expect(document.body.querySelectorAll('[data-td="rename-input"]').length).toBe(1);

    stateListeners.isItemRenaming({
      renamingItem: {
        id: 'notId',
      },
    });
    stateListeners.isItemRenaming({
      renamingItem: folder,
      isItemRenaming: true,
    });
    expect(document.body.querySelectorAll('[class="glyphicon glyphicon-repeat"]').length).toBe(1);
    stateListeners.isItemRenaming({
      renamingItem: folder,
      isItemRenaming: false,
    });

    stateListeners.itemRenamingErrors({
      renamingItem: {
        id: 'notId',
      },
    });
    stateListeners.itemRenamingErrors({
      renamingItem: folder,
      itemRenamingErrors: ['error'],
    });
    expect(document.body.querySelector('[class="help-block text-danger"]').textContent).toBe('error');
  });

  test('Shouldn`t open rename form on folder row', () => {
    expect.assertions(1);

    const wrapper = new FileListWrapper();
    let folderCreator;
    const setContentMock = jest.fn((folderCreators) => {
      folderCreator = folderCreators[0];
    });
    const state = {};
    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(() => {
          return state;
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
    state.renamingItem = folder;
    state.isItemRenaming = true;

    stateListeners.folderContent({
      folderContent: [
        folder,
      ],
      renamingItem: folder,
    });

    folderCreator(document.body);
    document.body.querySelector('[data-td="name-cell"]').dispatchEvent(new Event('dblclick'));
    expect(document.body.querySelectorAll('[data-td="rename-input"]').length).toBe(0);
  });

  test('Should render folder row and trigger renaming user events', () => {
    expect.assertions(2);

    const wrapper = new FileListWrapper();
    let folderCreator;
    const setContentMock = jest.fn((folderCreators) => {
      folderCreator = folderCreators[0];
    });
    const state = {};
    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(() => {
          return state;
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
    document.body.querySelector('[data-td="name-cell"]').dispatchEvent(new Event('dblclick'));
    state.isItemRenaming = false;
    expect(dispatchMock).toHaveBeenCalledWith(new DefineRenamingItemAction(folder));

    document.body.querySelector('[data-td="rename-input"]').dispatchEvent(new Event('change'));
    expect(dispatchMock).toHaveBeenCalledWith(new DefineRenamingItemAction(new RenameItemAction(folder)));
  });

  test('Should render file row and trigger renaming state events', () => {
    expect.assertions(3);

    const wrapper = new FileListWrapper();
    let fileCreator;
    const setContentMock = jest.fn((folderCreators, fileCreators) => {
      fileCreator = fileCreators[0];
    });

    const navigateListenerMock = jest.fn();

    wrapper.wrap({
      setContent: setContentMock,
    });
    wrapper.onNavigateToFolder(navigateListenerMock);

    const file = {
      type: 'file',
      name: 'name',
      id: 'id',
      size: 1,
    };

    stateListeners.folderContent({
      folderContent: [
        file,
      ],
    });

    fileCreator(document.body);

    stateListeners.renamingItem({
      renamingItem: {
        id: 'notId',
      },
    });
    stateListeners.renamingItem({
      renamingItem: file,
    });
    expect(document.body.querySelectorAll('[data-td="rename-input"]').length).toBe(1);

    stateListeners.isItemRenaming({
      renamingItem: {
        id: 'notId',
      },
    });
    stateListeners.isItemRenaming({
      renamingItem: file,
      isItemRenaming: true,
    });
    expect(document.body.querySelectorAll('[class="glyphicon glyphicon-repeat"]').length).toBe(1);
    stateListeners.isItemRenaming({
      renamingItem: file,
      isItemRenaming: false,
    });

    stateListeners.itemRenamingErrors({
      renamingItem: {
        id: 'notId',
      },
    });
    stateListeners.itemRenamingErrors({
      renamingItem: file,
      itemRenamingErrors: ['error'],
    });
    expect(document.body.querySelector('[class="help-block text-danger"]').textContent).toBe('error');
  });

  test('Should render file row and trigger renaming user events', () => {
    expect.assertions(2);

    const wrapper = new FileListWrapper();
    let fileCreator;
    const setContentMock = jest.fn((folderCreators, fileCreators) => {
      fileCreator = fileCreators[0];
    });
    const state = {};
    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(() => {
          return state;
        });

    const navigateListenerMock = jest.fn();

    wrapper.wrap({
      setContent: setContentMock,
    });
    wrapper.onNavigateToFolder(navigateListenerMock);

    const file = {
      type: 'file',
      name: 'name',
      id: 'id',
      size: 1,
    };

    stateListeners.folderContent({
      folderContent: [
        file,
      ],
    });

    fileCreator(document.body);
    document.body.querySelector('[data-td="name-cell"]').dispatchEvent(new Event('dblclick'));
    state.isItemRenaming = false;
    expect(dispatchMock).toHaveBeenCalledWith(new DefineRenamingItemAction(file));

    document.body.querySelector('[data-td="rename-input"]').dispatchEvent(new Event('change'));
    expect(dispatchMock).toHaveBeenCalledWith(new DefineRenamingItemAction(new RenameItemAction(file)));
  });

  test('Should render file row and trigger downloading events', () => {
    expect.assertions(3);

    const wrapper = new FileListWrapper();
    let fileCreator;
    const setContentMock = jest.fn((folderCreators, fileCreators) => {
      fileCreator = fileCreators[0];
    });
    const state = {};
    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(() => {
          return state;
        });

    const navigateListenerMock = jest.fn();

    wrapper.wrap({
      setContent: setContentMock,
    });
    wrapper.onNavigateToFolder(navigateListenerMock);

    const file = {
      type: 'file',
      name: 'name',
      id: 'id',
      size: 1,
    };

    stateListeners.folderContent({
      folderContent: [
        file,
      ],
    });

    fileCreator(document.body);
    document.body.querySelector('[data-td="download-button"]').dispatchEvent(new Event('click'));
    state.isItemRenaming = false;
    expect(dispatchMock).toHaveBeenCalledWith(new DownloadFileAction(file));

    stateListeners.downloadingFiles({
      downloadingFiles: [file.id],
    });
    expect(document.body.querySelector('[data-td="download-button"]').innerHTML.trim()).toBe(
        `<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>`);

    stateListeners.filesDownloadingError({
      filesDownloadingError: {
        [file.id]: 'error',
      },
    });
    expect(document.body.querySelector('[data-td="download-button"]').innerHTML.trim()).toBe(
        `<span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>`);
  });

  test('Shouldn`t open rename form on file row', () => {
    expect.assertions(1);

    const wrapper = new FileListWrapper();
    let fileCreator;
    const setContentMock = jest.fn((folderCreators, fileCreators) => {
      fileCreator = fileCreators[0];
    });
    const state = {};
    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(() => {
          return state;
        });

    const navigateListenerMock = jest.fn();

    wrapper.wrap({
      setContent: setContentMock,
    });
    wrapper.onNavigateToFolder(navigateListenerMock);

    const file = {
      type: 'file',
      name: 'name',
      id: 'id',
      size: 1,
    };
    state.renamingItem = file;
    state.isItemRenaming = true;

    stateListeners.folderContent({
      folderContent: [
        file,
      ],
      renamingItem: file,
    });

    fileCreator(document.body);
    document.body.querySelector('[data-td="name-cell"]').dispatchEvent(new Event('dblclick'));
    expect(document.body.querySelectorAll('[data-td="rename-input"]').length).toBe(0);
  });

  test('Should render file row and trigger removing events', () => {
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
      type: 'file',
      name: 'name',
      id: 'id',
      size: 1,
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

  test('Should sort folder and file by name', () => {
    expect.assertions(6);

    const wrapper = new FileListWrapper();
    let fileCreators;
    let folderCreators;
    const setContentMock = jest.fn((_folderCreators, _fileCreators) => {
      folderCreators = _folderCreators;
      fileCreators = _fileCreators;
    });

    wrapper.wrap({
      setContent: setContentMock,
    });

    const file = {
      type: 'file',
      id: 'id',
      size: 1,
    };
    const folder = {
      type: 'folder',
      id: 'id',
    };

    const fileA = {...file, name: 'fileA'};
    const fileB = {...file, name: 'fileB'};
    const fileC = {...file, name: 'fileC'};
    const folderA = {...folder, name: 'folderA'};
    const folderB = {...folder, name: 'folderB'};
    const folderC = {...folder, name: 'folderC'};


    stateListeners.folderContent({
      folderContent: [
        fileB,
        folderB,
        fileA,
        folderA,
        fileC,
        folderC,
      ],
    });

    [...folderCreators, ...fileCreators].forEach((creator) => creator(document.body));

    expect(document.body.querySelectorAll('[data-td="name-cell"]')[0].textContent).toBe(folderA.name);
    expect(document.body.querySelectorAll('[data-td="name-cell"]')[1].textContent).toBe(folderB.name);
    expect(document.body.querySelectorAll('[data-td="name-cell"]')[2].textContent).toBe(folderC.name);
    expect(document.body.querySelectorAll('[data-td="name-cell"]')[3].textContent).toBe(fileA.name);
    expect(document.body.querySelectorAll('[data-td="name-cell"]')[4].textContent).toBe(fileB.name);
    expect(document.body.querySelectorAll('[data-td="name-cell"]')[5].textContent).toBe(fileC.name);
  });
});
