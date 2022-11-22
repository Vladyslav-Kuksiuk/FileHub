import {Button} from '../../src/components/button';
import {jest} from '@jest/globals';

describe('Button', () => {
  const buttonText = 'myButton';
  const defaultSnapshot =
      `<button class="btn btn-default" title="${buttonText}" data-td="button-component">${buttonText}</button>`;

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

  test(`Should change button title`, function() {
    expect.assertions(2);

    const button = new Button(document.body, buttonText);

    expect(document.body.innerHTML).toBe(defaultSnapshot);

    const newTitle = 'newTitle';
    button.title = newTitle;

    const newSnapshot =
        `<button class="btn btn-default" title="${newTitle}" data-td="button-component">myButton</button>`;

    expect(document.body.innerHTML).toBe(newSnapshot);
  });

  test(`Should change button text`, function() {
    expect.assertions(2);

    const button = new Button(document.body, buttonText);

    expect(document.body.innerHTML).toBe(defaultSnapshot);

    const newText = 'newText';
    button.text = newText;

    const newSnapshot =
        `<button class="btn btn-default" title="${buttonText}" data-td="button-component">${newText}</button>`;

    expect(document.body.innerHTML).toBe(newSnapshot);
  });

  test(`Should change button type`, function() {
    expect.assertions(2);

    const button = new Button(document.body, buttonText);

    expect(document.body.innerHTML).toBe(defaultSnapshot);

    const newType = 'btn-primary';
    button.type = newType;

    const newSnapshot =
        `<button class="btn ${newType}" title="${buttonText}" data-td="button-component">${buttonText}</button>`;

    expect(document.body.innerHTML).toBe(newSnapshot);
  });

  test(`Should change button disabled state`, function() {
    expect.assertions(2);

    const button = new Button(document.body, buttonText);

    expect(document.body.innerHTML).toBe(defaultSnapshot);

    button.isDisabled = true;

    const newSnapshot =
`<button class="btn btn-default" title="${buttonText}" disabled="" data-td="button-component">${buttonText}</button>`;

    expect(document.body.innerHTML).toBe(newSnapshot);
  });

  test('Should trigger click event', function() {
    expect.assertions(1);

    const button = new Button(document.body, buttonText);
    const listenerMock = jest.fn();
    button.onClick(listenerMock);

    document.body.querySelector('button').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});

