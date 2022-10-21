import {UserData} from '../src/user-data';

describe('UserData', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`UserData constructor`, function() {
    expect.assertions(2);

    const data = new UserData('login', 'password');

    expect(data.login).toBe('login');
    expect(data.password).toBe('password');
  });
});
