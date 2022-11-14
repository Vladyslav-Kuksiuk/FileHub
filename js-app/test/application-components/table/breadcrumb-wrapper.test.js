import {ApplicationContext} from '../../../src/application-context';
import {LoadUserAction} from '../../../src/state-management/user/load-user-action';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';
import {BreadcrumbWrapper} from '../../../src/application-components/table/breadcrumb-wrapper';
import {Breadcrumb} from '../../../src/components/breadcrumb';
import {State} from '../../../src/state-management/state';
import {jest} from '@jest/globals';

describe('BreadcrumbWrapper', () => {
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

  test(`Should dispatch LoadUserAction and LoadFolderInfoAction`, function() {
    expect.assertions(3);

    jest.spyOn(applicationContext.stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return new State({
            isUserProfileLoading: false,
          });
        });

    new BreadcrumbWrapper(applicationContext);

    stateListeners.userProfile?.({userProfile: {rootFolderId: '123'}});
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenCalledWith(new LoadUserAction(applicationContext.apiService));
    expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction('123', applicationContext.apiService));
  });

  test(`Should not dispatch LoadUserAction and LoadFolderInfoAction`, function() {
    expect.assertions(1);

    jest.spyOn(applicationContext.stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            userProfile: {},
          };
        });

    new BreadcrumbWrapper(applicationContext);

    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });

  test(`Should add state listeners.`, function() {
    expect.assertions(6);

    const wrapper = new BreadcrumbWrapper(applicationContext);
    const breadcrumb = new Breadcrumb(document.body, false, false, []);

    const isLoadingMock = jest.spyOn(breadcrumb, 'isLoading', 'set').mockImplementation(()=>{});
    const hasErrorMock = jest.spyOn(breadcrumb, 'hasError', 'set').mockImplementation(()=>{});
    const pathMock = jest.spyOn(breadcrumb, 'path', 'set').mockImplementation(()=>{});

    wrapper.wrap(breadcrumb);
    expect(Object.keys(stateListeners)).toContain('isFolderInfoLoading');
    expect(Object.keys(stateListeners)).toContain('folderInfo');
    expect(Object.keys(stateListeners)).toContain('folderInfoError');

    stateListeners.isFolderInfoLoading?.({});
    stateListeners.folderInfo?.({});
    stateListeners.folderInfoError?.({});

    expect(isLoadingMock).toHaveBeenCalledTimes(1);
    expect(hasErrorMock).toHaveBeenCalledTimes(1);
    expect(pathMock).toHaveBeenCalledTimes(1);
  });

  test(`Should set breadcrumb path as Home/Folder.`, function() {
    expect.assertions(2);

    const wrapper = new BreadcrumbWrapper(applicationContext);
    const breadcrumb = new Breadcrumb(document.body, false, false, []);

    const pathMock = jest.spyOn(breadcrumb, 'path', 'set').mockImplementation(()=>{});

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
  });

  test(`Should set breadcrumb path as Home/.../Folder.`, function() {
    expect.assertions(2);

    const wrapper = new BreadcrumbWrapper(applicationContext);
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
