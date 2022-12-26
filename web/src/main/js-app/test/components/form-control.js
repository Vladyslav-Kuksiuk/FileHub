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
});
