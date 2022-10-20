import {AuthorizationPage} from '../../src/components/authorization-page';
import {TitleService} from '../../src/title-service';

describe('AuthorizationPage Component', () => {
  test(`AuthorizationPage constructor`, function() {
    expect.assertions(4);

    expect(document.body.querySelectorAll('[data-td="form"]').length).toBe(0);
    new AuthorizationPage(document.body, new TitleService('FileHub', ' - '));
    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('main h1').textContent).toBe('Sign in to FileHub');
    expect(document.title).toBe('FileHub - Sign In');
  });
});
