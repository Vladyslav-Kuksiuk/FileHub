import {Button} from '../../src/components/button';

describe('Button Component', () => {
  test(`Button constructor`, function() {
    expect.assertions(3);
    expect(document.body.querySelectorAll('[data-td="button-component"]').length).toBe(0);

    const buttonText = 'myButton';
    new Button(document.body, buttonText);

    expect(document.body.querySelectorAll('[data-td="button-component"]').length).toBe(1);
    expect(document.body.querySelector('[data-td="button-component"]').textContent).toBe(buttonText);
  });
});

