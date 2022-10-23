import {FormControl} from '../../src/components/form-control';

describe('FormControl', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should create and render FormControl component`, function() {
    expect.assertions(7);

    const name = 'myName';
    const labelText = 'myLabel';
    const placeholder = 'myPlaceholder';
    const type = 'email';
    const placeholderDefault = '';
    const typeDefault = 'text';
    new FormControl(document.body, {
      name: name,
      labelText: labelText,
    });

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(1);
    expect(document.body.querySelector('[data-td="form-control"] input').name).toBe(name);
    expect(document.body.querySelector('[data-td="form-control"] label').textContent).toBe(labelText);
    expect(document.body.querySelector('[data-td="form-control"] input').type).toBe(typeDefault);
    expect(document.body.querySelector('[data-td="form-control"] input').placeholder).toBe(placeholderDefault);

    document.body.innerHTML = '';
    new FormControl(document.body, {
      name: name,
      labelText: labelText,
      placeholder: placeholder,
      type: type,
    });

    expect(document.body.querySelector('[data-td="form-control"] input').type).toBe(type);
    expect(document.body.querySelector('[data-td="form-control"] input').placeholder).toBe(placeholder);
  });
});
