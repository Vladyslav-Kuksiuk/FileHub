import {UserInfo} from '../../src/components/user-info';

describe('UserInfo', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should render UserInfo component with username`, function() {
    expect.assertions(1);

    const username = 'testUser';
    new UserInfo(document.body, false, username, false);
    expect(document.body.querySelector('[data-td="user-info-username"]').textContent).toBe(username);
  });

  test(`Should render UserInfo component with loading`, function() {
    expect.assertions(1);

    new UserInfo(document.body, true, null, false);
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(1);
  });

  test(`Should render UserInfo component with error`, function() {
    expect.assertions(1);

    new UserInfo(document.body, false, null, true);
    expect(document.body.querySelectorAll('[data-td="user-info-error"]').length).toBe(1);
  });

  test('Should change state successfully->error->loading', function() {
    expect.assertions(3);
    const userInfo = new UserInfo(document.body, false, 'user', false);
    expect(document.body.querySelector('[data-td="user-info-username"]').textContent).toBe('user');

    userInfo.username = null;
    userInfo.hasError = true;
    expect(document.body.querySelectorAll('[data-td="user-info-error"]').length).toBe(1);

    userInfo.hasError = false;
    userInfo.isLoading = true;
    expect(document.body.querySelectorAll('[data-td="user-info-loading"]').length).toBe(1);
  } );
});
