import {Button} from '../../src/components/button';

const {module, test} = QUnit;

module('Button Component', () => {
  test(`Button constructor`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="button-component"]').length, 0,
        'Should return number of buttons before creating.');

    const buttonText = 'myButton';
    new Button(fixture, buttonText);

    assert.strictEqual(fixture.querySelectorAll('[data-td="button-component"]').length, 1,
        'Should return number of buttons after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="button-component"]').innerText, buttonText,
        'Should return button innerText: myButton.');
  });
});
