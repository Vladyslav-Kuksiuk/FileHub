import {Button} from '../../src/components/button';

describe('Button', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should create and render Button component`, function() {
    expect.assertions(2);

    const buttonText = 'myButton';
    new Button(document.body, buttonText);

    expect(document.body.querySelectorAll('[data-td="button-component"]').length).toBe(1);
    expect(document.body.querySelector('[data-td="button-component"]').textContent).toBe(buttonText);
  });
});

