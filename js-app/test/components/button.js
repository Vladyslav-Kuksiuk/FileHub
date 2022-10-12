import {Button} from '../../src/components/button';

const {module, test} = QUnit;

module('Button Component', () => {
  test(``, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="button"]').length, 0,
        'Should return number of buttons before creating.');

    new Button(fixture, 'myButton');

    assert.strictEqual(fixture.querySelectorAll('[data-td="button"]').length, 1,
        'Should return number of buttons after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="button"]').innerText, 'myButton',
        'Should return button innerText: myButton.');
  });
});
