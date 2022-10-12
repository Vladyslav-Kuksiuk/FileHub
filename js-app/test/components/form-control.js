import {FormControl} from '../../src/components/form-control';

const {module, test} = QUnit;

module('FormControl Component', () => {
  test(`FormControl constructor`, function(assert) {
    assert.expect(8);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 0,
        'Should return number of form controls before creating.');

    const name = 'myName';
    const labelText = 'myLabel';
    const placeholder = 'myPlaceholder';
    const type = 'email';
    const placeholderDefault = '';
    const typeDefault = 'text';
    new FormControl(fixture, {
      name: name,
      labelText: labelText,
    });

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 1,
        'Should return number of form controls after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').name, name,
        `Should return input name : ${name}.`);
    assert.strictEqual(fixture.querySelector('[data-td="form-control"] label').innerText, labelText,
        `Should return label innerText : ${labelText}.`);
    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').type, typeDefault,
        `Should return input default type : ${typeDefault}.`);
    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').placeholder, placeholderDefault,
        `Should return input default placeholder  : ${placeholderDefault}.`);

    fixture.innerHTML = '';
    new FormControl(fixture, {
      name: name,
      labelText: labelText,
      placeholder: placeholder,
      type: type,
    });

    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').type, type,
        `Should return input type : ${type}.`);
    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').placeholder, placeholder,
        `Should return input placeholder  : ${placeholder}.`);
  });

  test(`Error messages`, function(assert) {
    assert.expect(4);
    const fixture = document.getElementById('qunit-fixture');

    const formControl = new FormControl(fixture, {
      name: 'myName',
      labelText: 'myLabel',
    });

    assert.strictEqual(fixture.querySelectorAll('[data-td="error-message"]').length, 0,
        'Should return number of errors before adding.');

    const error1Text = 'error1';
    formControl.addErrorMessage(error1Text);
    assert.strictEqual(fixture.querySelectorAll('[data-td="error-message"]')[0].innerText, error1Text,
        `Should return text of error1 : ${error1Text}.`);

    const error2Text = 'error2';
    formControl.addErrorMessage(error2Text);
    assert.strictEqual(fixture.querySelectorAll('[data-td="error-message"]')[1].innerText, error2Text,
        `Should return text of error2 : ${error2Text}.`);

    formControl.clearErrorMessages();
    assert.strictEqual(fixture.querySelectorAll('[data-td="error-message"]').length, 0,
        'Should return number of errors after clearing.');
  });

  test(`saveValues`, function(assert) {
    assert.expect(2);
    const fixture = document.getElementById('qunit-fixture');

    const inputValue = 'myValue';
    const formControl = new FormControl(fixture, {
      name: 'myName',
      labelText: 'myLabel',
    });

    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').value, '',
        'Should return input value after creating :.');

    fixture.querySelector('[data-td="form-control"] input').value = inputValue;
    formControl.saveValue();
    formControl.render();

    assert.strictEqual(fixture.querySelector('[data-td="form-control"] input').value, inputValue,
        `Should return input value after save and render : ${inputValue}.`);
  });
});
