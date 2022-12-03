import {BreadcrumbWrapper} from '../../../src/application-components/table/breadcrumb-wrapper';
import {Breadcrumb} from '../../../src/components/breadcrumb';
import {jest} from '@jest/globals';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {clearRegistry, registry} from '../../../src/registry';
import {ApiService} from '../../../src/server-connection/api-service';
import {StateManagementService} from '../../../src/state-management/state-management-service';

describe('BreadcrumbWrapper', () => {
  let stateListeners = {};
  let dispatchMock;
  let addStateListenerMock;

  beforeEach(() => {
    clearRegistry();

    const apiService = new ApiService({});
    const stateManagementService = new StateManagementService({}, {});

    registry.register('apiService', () => {
      return apiService;
    });

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });

    stateListeners = {};
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
  });

  test('Should add userProfile and locationMetadata state listeners', function() {
    expect.assertions(3);
    new BreadcrumbWrapper();

    expect(addStateListenerMock).toHaveBeenCalledTimes(2);
    expect(addStateListenerMock).toHaveBeenCalledWith('userProfile', stateListeners['userProfile']);
    expect(addStateListenerMock).toHaveBeenCalledWith('locationMetadata', stateListeners['locationMetadata']);
  });

  test('Should dispatch LoadFolderInfoAction by userProfile state listener', function() {
    expect.assertions(2);
    new BreadcrumbWrapper();
    const locationMetadata = {
      folderId: '123',
    };

    stateListeners['userProfile']({
      userProfile: {},
      locationMetadata: locationMetadata,
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock)
        .toHaveBeenCalledWith(new LoadFolderInfoAction(locationMetadata.folderId));
  });

  test('Should dispatch folder navigation event by userProfile state listener', function() {
    expect.assertions(2);
    const breadcrumbWrapper = new BreadcrumbWrapper();
    const userProfile = {
      rootFolderId: '123',
    };

    const navigateListenerMock = jest.fn();
    breadcrumbWrapper.onNavigateToFolder(navigateListenerMock);

    stateListeners['userProfile']({
      userProfile: userProfile,
    });

    expect(navigateListenerMock).toHaveBeenCalledTimes(1);
    expect(navigateListenerMock)
        .toHaveBeenCalledWith(userProfile.rootFolderId);
  });

  test('Should dispatch LoadFolderInfoAction by locationMetadata state listener', function() {
    expect.assertions(2);
    new BreadcrumbWrapper();
    const locationMetadata = {
      folderId: '123',
    };

    stateListeners['locationMetadata']({
      userProfile: {},
      locationMetadata: locationMetadata,
    });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock)
        .toHaveBeenCalledWith(new LoadFolderInfoAction(locationMetadata.folderId));
  });

  test(`Should add state listeners.`, function() {
    expect.assertions(12);

    const wrapper = new BreadcrumbWrapper();
    const breadcrumb = new Breadcrumb(document.body, false, false, []);

    const isLoadingMock = jest.spyOn(breadcrumb, 'isLoading', 'set').mockImplementation(()=>{});
    const hasErrorMock = jest.spyOn(breadcrumb, 'hasError', 'set').mockImplementation(()=>{});
    const pathMock = jest.spyOn(breadcrumb, 'path', 'set').mockImplementation(()=>{});

    expect(Object.keys(stateListeners)).toContain('userProfile');
    expect(Object.keys(stateListeners)).toContain('locationMetadata');

    stateListeners.userProfile({
      userProfile: null,
    });

    wrapper.wrap(breadcrumb);
    expect(Object.keys(stateListeners)).toContain('isFolderInfoLoading');
    expect(Object.keys(stateListeners)).toContain('isUserProfileLoading');
    expect(Object.keys(stateListeners)).toContain('folderInfo');
    expect(Object.keys(stateListeners)).toContain('folderInfoError');

    stateListeners.isFolderInfoLoading?.({
      isFolderInfoLoading: false,
    });
    stateListeners.isUserProfileLoading?.({
      isUserProfileLoading: true,
    });
    stateListeners.isUserProfileLoading?.({
      isUserProfileLoading: false,
    });
    stateListeners.folderInfo?.({});
    stateListeners.folderInfoError?.({
      folderInfoError: 'error',
    });

    expect(isLoadingMock).toHaveBeenCalledTimes(2);
    expect(isLoadingMock).toHaveBeenCalledWith(true);
    expect(isLoadingMock).toHaveBeenCalledWith(false);
    expect(hasErrorMock).toHaveBeenCalledTimes(1);
    expect(hasErrorMock).toHaveBeenCalledWith(true);
    expect(pathMock).toHaveBeenCalledTimes(1);
  });

  test(`Should set breadcrumb path as Home.`, function() {
    expect.assertions(2);

    const wrapper = new BreadcrumbWrapper();
    const breadcrumb = new Breadcrumb(document.body, false, false, []);

    const pathMock = jest.spyOn(breadcrumb, 'path', 'set').mockImplementation(()=>{});

    const navigateListenerMock = jest.fn();
    wrapper.onNavigateToFolder(navigateListenerMock);

    wrapper.wrap(breadcrumb);

    stateListeners.folderInfo?.({
      userProfile: {
        rootFolderId: '123',
      },
      folderInfo: {
        parentId: null,
        name: 'Folder',
      },
    });

    expect(pathMock).toHaveBeenCalledTimes(1);
    expect(pathMock.mock.calls[0][0]+'').toStrictEqual(
        [
          {name: 'Home'}]+'');
  });

  test(`Should set breadcrumb path as Home/Folder.`, function() {
    expect.assertions(3);

    const wrapper = new BreadcrumbWrapper();
    const breadcrumb = new Breadcrumb(document.body, false, false, []);

    let path;
    const pathMock = jest.spyOn(breadcrumb, 'path', 'set').mockImplementation((value)=>{
      path = value;
    });

    const navigateListenerMock = jest.fn();
    wrapper.onNavigateToFolder(navigateListenerMock);

    wrapper.wrap(breadcrumb);

    stateListeners.folderInfo?.({
      userProfile: {
        rootFolderId: '123',
      },
      folderInfo: {
        parentId: '123',
        name: 'Folder',
      },
    });

    expect(pathMock).toHaveBeenCalledTimes(1);
    expect(pathMock.mock.calls[0][0]+'').toStrictEqual(
        [
          {name: 'Home', linkListener: ()=>{}},
          {name: 'Folder'}]+'');
    path[0].linkListener();
    expect(navigateListenerMock).toHaveBeenCalledWith('123');
  });

  test(`Should set breadcrumb path as Home/.../Folder.`, function() {
    expect.assertions(2);

    const wrapper = new BreadcrumbWrapper();
    const breadcrumb = new Breadcrumb(document.body, false, false, []);

    const pathMock = jest.spyOn(breadcrumb, 'path', 'set').mockImplementation(()=>{});

    wrapper.wrap(breadcrumb);

    stateListeners.folderInfo?.({
      userProfile: {
        rootFolderId: '32123',
      },
      folderInfo: {
        parentId: '123',
        name: 'Folder',
      },
    });

    expect(pathMock).toHaveBeenCalledTimes(1);
    expect(pathMock.mock.calls[0][0]+'').toStrictEqual(
        [
          {name: 'Home', linkListener: ()=>{}},
          {name: '...', linkListener: ()=>{}},
          {name: 'Folder'}]+'');
  });
});
