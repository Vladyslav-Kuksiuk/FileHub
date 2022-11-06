import {ApplicationContext} from '../../src/application-context';
import {StateManagementService} from '../../src/state-management/state-management-service';
import {Breadcrumb} from '../../src/components/breadcrumb/index';
import {MUTATORS} from '../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {FOLDER_INFO, STATE, USER_PROFILE} from '../../src/state-management/state';

describe('Breadcrumb', () => {
  const userProfile = {
    [USER_PROFILE.USERNAME]: 'username',
    [USER_PROFILE.ROOT_FOLDER_ID]: 'username-0',
  };

  const rootFolderInfo = {
    [FOLDER_INFO.NAME]: 'rootFolder',
    [FOLDER_INFO.ID]: userProfile[USER_PROFILE.ROOT_FOLDER_ID],
    [FOLDER_INFO.PARENT_ID]: null,
    [FOLDER_INFO.ITEMS_AMOUNT]: 10,
  };

  const firstInnerFolderInfo = {
    [FOLDER_INFO.NAME]: 'firstInnerFolder',
    [FOLDER_INFO.ID]: 'username-1',
    [FOLDER_INFO.PARENT_ID]: rootFolderInfo[FOLDER_INFO.ID],
    [FOLDER_INFO.ITEMS_AMOUNT]: 5,
  };

  const secondInnerFolderInfo = {
    [FOLDER_INFO.NAME]: 'firstInnerFolder',
    [FOLDER_INFO.ID]: 'username-2',
    [FOLDER_INFO.PARENT_ID]: firstInnerFolderInfo[FOLDER_INFO.ID],
    [FOLDER_INFO.ITEMS_AMOUNT]: 5,
  };

  const error = 'ErrorText';
  let state;

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
  });

  test(`Should render Breadcrumb loading state`, function() {
    expect.assertions(1);

    const applicationContext = new ApplicationContext();
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-loading"]').length).toBe(1);
  });

  test(`Should render Breadcrumb error state`, function() {
    expect.assertions(1);

    const applicationContext = new ApplicationContext();
    state[STATE.IS_USER_PROFILE_LOADING] = false;
    state[STATE.IS_FOLDER_INFO_LOADING] = false;
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-error"]').length).toBe(1);
  });

  test(`Should render Breadcrumb error state`, function() {
    expect.assertions(1);

    const applicationContext = new ApplicationContext();
    state[STATE.IS_USER_PROFILE_LOADING] = false;
    state[STATE.IS_FOLDER_INFO_LOADING] = false;
    state[STATE.USER_PROFILE] = userProfile;
    state[STATE.FOLDER_INFO_ERROR] = error;
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-error"]').length).toBe(1);
  });

  test(`Should render Breadcrumb home state`, function() {
    expect.assertions(2);

    const applicationContext = new ApplicationContext();

    state[STATE.IS_USER_PROFILE_LOADING] = false;
    state[STATE.IS_FOLDER_INFO_LOADING] = false;
    state[STATE.USER_PROFILE] = userProfile;
    state[STATE.FOLDER_INFO] = rootFolderInfo;

    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(1);
    expect(document.body.querySelector('[data-td="breadcrumb-component"] li').textContent).toBe('Home');
  });

  test(`Should render Breadcrumb first inner state`, function() {
    expect.assertions(3);

    const applicationContext = new ApplicationContext();

    state[STATE.IS_USER_PROFILE_LOADING] = false;
    state[STATE.IS_FOLDER_INFO_LOADING] = false;
    state[STATE.USER_PROFILE] = userProfile;
    state[STATE.FOLDER_INFO] = firstInnerFolderInfo;

    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(2);
    expect(document.body.querySelector('[data-td="breadcrumb-component"] li a').textContent).toBe('Home');
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li')[1].textContent)
        .toBe(firstInnerFolderInfo[FOLDER_INFO.NAME]);
  });

  test(`Should render Breadcrumb second inner state`, function() {
    expect.assertions(4);

    const applicationContext = new ApplicationContext();

    state[STATE.IS_USER_PROFILE_LOADING] = false;
    state[STATE.IS_FOLDER_INFO_LOADING] = false;
    state[STATE.USER_PROFILE] = userProfile;
    state[STATE.FOLDER_INFO] = secondInnerFolderInfo;

    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(3);
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li a')[0].textContent).toBe('Home');
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li a')[1].textContent).toBe('...');
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li')[2].textContent)
        .toBe(secondInnerFolderInfo[FOLDER_INFO.NAME]);
  });

  test(`Should rerender Breadcrumb after each state changing`, function() {
    expect.assertions(6);

    const applicationContext = new ApplicationContext();
    const stateManagementService = new StateManagementService(MUTATORS, state, applicationContext);

    const fieldListeners = {
      [STATE.USER_PROFILE]: null,
      [STATE.IS_FOLDER_INFO_LOADING]: null,
      [STATE.FOLDER_INFO]: null,
      [STATE.FOLDER_INFO_ERROR]: null,
    };

    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener) => {
          fieldListeners[field] = listener;
        });

    new Breadcrumb(document.body, stateManagementService);

    expect(document.body.querySelectorAll('[data-td="breadcrumb-loading"]').length).toBe(1);

    state[STATE.USER_PROFILE] = userProfile;
    fieldListeners[STATE.USER_PROFILE](state);
    state[STATE.IS_FOLDER_INFO_LOADING] = false;
    fieldListeners[STATE.IS_FOLDER_INFO_LOADING](state);
    state[STATE.FOLDER_INFO_ERROR] = error;
    fieldListeners[STATE.FOLDER_INFO_ERROR](state);
    expect(document.body.querySelectorAll('[data-td="breadcrumb-error"]').length).toBe(1);

    state[STATE.FOLDER_INFO_ERROR] = null;
    fieldListeners[STATE.FOLDER_INFO_ERROR](state);
    state[STATE.FOLDER_INFO] = secondInnerFolderInfo;
    fieldListeners[STATE.FOLDER_INFO](state);
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li').length).toBe(3);
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li a')[0].textContent).toBe('Home');
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li a')[1].textContent).toBe('...');
    expect(document.body.querySelectorAll('[data-td="breadcrumb-component"] li')[2].textContent)
        .toBe(secondInnerFolderInfo[FOLDER_INFO.NAME]);
  });
});
