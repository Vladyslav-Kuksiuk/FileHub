import {Form} from '../../src/components/form';
import {FormControl} from '../../src/components/form-control';
import {Link} from '../../src/components/link';

const {module, test} = QUnit;

module('Form Component', () => {
  test(`Form constructor`, function(assert) {
    assert.expect(4);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-component"]').length, 0,
        'Should return number of forms before creating.');

    const buttonText = 'myButton';
    const linkText = 'myLink';
    new Form(fixture, {buttonText: buttonText,
      linkCreator: (slot)=>{
        new Link(slot, linkText);
      }});

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-component"]').length, 1,
        'Should return number of forms after creating.');
    assert.strictEqual(fixture.querySelector('[data-td="form-component"] button').innerText, buttonText,
        `Should return button innerText: ${buttonText}.`);
    assert.strictEqual(fixture.querySelector('[data-td="form-component"] a').innerText, linkText,
        `Should return link innerText: ${linkText}.`);
  });

  test(`addFormControl`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');
    const form = new Form(fixture, {buttonText: 'myButton',
      linkCreator: (slot)=>{
        new Link(slot, 'myLink');
      }});

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 0,
        'Should return number of form controls before adding.');

    form.addFormControl((slot) =>{
      new FormControl(slot, {
        name: 'Input1',
        labelText: 'Input1',
      });
    });

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 1,
        'Should return number of form controls after adding first.');

    form.addFormControl((slot) =>{
      new FormControl(slot, {
        name: 'Input2',
        labelText: 'Input2',
      });
    });

    assert.strictEqual(fixture.querySelectorAll('[data-td="form-control"]').length, 2,
        'Should return number of form controls after adding second.');
  });

  test(`onSubmit`, function(assert) {
    assert.expect(2);
    const fixture = document.getElementById('qunit-fixture');
    const form = new Form(fixture, {buttonText: 'myButton',
      linkCreator: (slot)=>{
        new Link(slot, 'myLink');
      }});

    let isSubmitted = false;
    form.onSubmit((formData) => {
      isSubmitted = !!formData;
    });

    assert.notOk(isSubmitted, 'Should return isSubmitted before submit : false.');
    fixture.querySelector('[data-td="button-component"]').click();
    assert.ok(isSubmitted, 'Should return isSubmitted after submit : true.');
  });
});
