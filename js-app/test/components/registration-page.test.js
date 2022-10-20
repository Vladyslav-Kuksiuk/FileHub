import {RegistrationPage} from '../../src/components/registration-page';
import {TitleService} from '../../src/title-service';

describe('RegistrationPage Component', () => {
  test(`RegistrationPage constructor`, function() {
    expect.assertions(4);

    expect(document.body.querySelectorAll('[data-td="form"]').length).toBe(0);

    new RegistrationPage(document.body, new TitleService('FileHub', ' - '));
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign up to FileHub');
    expect(document.title).toBe('FileHub - Sign Up');
  });
});
