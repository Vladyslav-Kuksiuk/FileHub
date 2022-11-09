import {ApplicationContext} from '../../../src/application-context';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {BreadcrumbWrapper} from '../../../src/application-components/table/breadcrumb-wrapper';
import {MUTATORS} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {STATE} from '../../../src/state-management/state';
import {FolderInfo} from '../../../src/state-management/folder/folder-info';
import {UserProfile} from '../../../src/state-management/user/user-profile';
import {LoadFolderInfoAction} from '../../../src/state-management/folder/load-folder-info-action';

describe('Breadcrumb', () => {
  const userProfile = new UserProfile(
      'username',
      'username-0',
  );

  const rootFolderInfo = new FolderInfo(
      'rootFolder',
      'username-0',
      null,
      1,
  );

  const firstInnerFolderInfo = new FolderInfo(
      'firstInnerFolder',
      'username-1',
      'username-0',
      2,
  );

  const secondInnerFolderInfo = new FolderInfo(
      'secondInnerFolder',
      'username-2',
      'username-1',
      3,
  );

  const error = 'ErrorText';
  let state;
  let stateManagementService;
  let stateListeners;
  let dispatchMock;

  beforeEach(() => {
    document.body.innerHTML = '';

    state = {
      [STATE.IS_USER_PROFILE_LOADING]: true,
      [STATE.USER_PROFILE]: null,
      [STATE.USER_PROFILE_ERROR]: null,
      [STATE.IS_FOLDER_INFO_LOADING]: true,
      [STATE.FOLDER_INFO]: null,
      [STATE.FOLDER_INFO_ERROR]: null,
    };
    const applicationContext = new ApplicationContext();
    stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    stateListeners = [];
    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners.push(listener);
        });
    dispatchMock = jest.spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should render Breadcrumb loading state`, function() {
    expect.assertions(1);

    new BreadcrumbWrapper(document.body, stateManagementService);
    stateListeners.forEach((listener) => listener(state));

    return Promise.resolve().then(()=>{
      expect(document.body.querySelectorAll('[data-td="breadcrumb-loading"]').length).toBe(1);
    });
  });

  test(`Should render Breadcrumb error state`, function() {
    return new Promise((done) => {
      expect.assertions(2);

      state[STATE.IS_USER_PROFILE_LOADING] = false;
      state[STATE.IS_FOLDER_INFO_LOADING] = false;
      state[STATE.USER_PROFILE] = userProfile;
      state[STATE.FOLDER_INFO_ERROR] = error;

      new BreadcrumbWrapper(document.body, stateManagementService);
      stateListeners.forEach((listener) => listener(state));

      setTimeout(()=>{
        expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction(userProfile.rootFolderId));
        expect(document.body.querySelectorAll('[data-td="breadcrumb-error"]').length).toBe(1);
        done();
      });
    });
  });

  test(`Should render Breadcrumb home state`, function() {
    return new Promise((done) => {
      expect.assertions(3);

      state[STATE.IS_USER_PROFILE_LOADING] = false;
      state[STATE.IS_FOLDER_INFO_LOADING] = false;
      state[STATE.USER_PROFILE] = userProfile;
      state[STATE.FOLDER_INFO] = rootFolderInfo;

      new BreadcrumbWrapper(document.body, stateManagementService);
      stateListeners.forEach((listener) => listener(state));

      setTimeout(()=> {
        expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction(userProfile.rootFolderId));
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(1);
        expect(document.body.querySelector('[data-td="breadcrumb-component"] li').textContent).toBe('Home');
        done();
      });
    });
  });

  test(`Should render Breadcrumb first inner state`, function() {
    return new Promise((done) => {
      expect.assertions(4);

      state[STATE.IS_USER_PROFILE_LOADING] = false;
      state[STATE.IS_FOLDER_INFO_LOADING] = false;
      state[STATE.USER_PROFILE] = userProfile;
      state[STATE.FOLDER_INFO] = firstInnerFolderInfo;

      new BreadcrumbWrapper(document.body, stateManagementService);
      stateListeners.forEach((listener) => listener(state));

      setTimeout(()=> {
        expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction(userProfile.rootFolderId));
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(2);
        expect(document.body.querySelector('[data-td="breadcrumb-component"] li a').textContent).toBe('Home');
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li')[1].textContent)
            .toBe(firstInnerFolderInfo.name);
        done();
      });
    });
  });

  test(`Should render Breadcrumb second inner state`, function() {
    return new Promise((done) => {
      expect.assertions(5);

      state[STATE.IS_USER_PROFILE_LOADING] = false;
      state[STATE.IS_FOLDER_INFO_LOADING] = false;
      state[STATE.USER_PROFILE] = userProfile;
      state[STATE.FOLDER_INFO] = secondInnerFolderInfo;

      new BreadcrumbWrapper(document.body, stateManagementService);
      stateListeners.forEach((listener) => listener(state));

      setTimeout(()=> {
        expect(dispatchMock).toHaveBeenCalledWith(new LoadFolderInfoAction(userProfile.rootFolderId));
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(3);
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li a')[0].textContent).toBe('Home');
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li a')[1].textContent).toBe('...');
        expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li')[2].textContent)
            .toBe(secondInnerFolderInfo.name);
        done();
      });
    });
  });
});
