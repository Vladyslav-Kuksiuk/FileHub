import {Link} from '../../src/components/link';

const {module, test} = QUnit;

module('Link Component', () => {
  test(`Link constructor`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="link-component"]').length, 0,
      'Should return number of links before creating.');

    const linkText = 'myLink';
    new Link(fixture, linkText);

    assert.strictEqual(fixture.querySelectorAll('[data-td="link-component"]').length, 1,
      'Should return number of links after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="link-component"]').innerText, linkText,
      'Should return link innerText: myLink.');
  });

  test('onClick', function(assert){
    assert.expect(2);
    const fixture = document.getElementById('qunit-fixture');
    const link = new Link(fixture, 'myLink');

    let isClicked = false;
    link.onClick(()=>{
      isClicked = true;
    })

    assert.notOk(isClicked, 'Should return isClicked before click : false.')
    fixture.querySelector('[data-td="link-component"]').click()
    assert.ok(isClicked, 'Should return isClicked after click : true.')
  })

});
