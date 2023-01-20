import {Form} from '../../src/components/form';
import {FormControl} from '../../src/components/form-control';
import {Link} from '../../src/components/link';

describe('Form', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test('Should create and render Form component', function() {
    expect.assertions(3);

    const buttonText = 'myButton';
    const linkText = 'myLink';
    new Form(document.body, {buttonText: buttonText,
      linkCreator: (slot)=>{
        new Link(slot, linkText);
      }});

    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(1);
    expect(document.body.querySelector('[data-td="form-component"] button').textContent).toBe(buttonText);
    expect(document.body.querySelector('[data-td="form-component"] a').textContent).toBe(linkText);
  });

  test(`Should create and render Form component with FormControl components`, function() {
    expect.assertions(3);

    const form = new Form(document.body, {buttonText: 'myButton',
      linkCreator: (slot)=>{
        new Link(slot, 'myLink');
      }});

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(0);

    form.addFormControl((slot) =>{
      new FormControl(slot, {
        name: 'Input1',
        labelText: 'Input1',
      });
    });

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(1);

    form.addFormControl((slot) =>{
      new FormControl(slot, {
        name: 'Input2',
        labelText: 'Input2',
      });
    });

    expect(document.body.querySelectorAll('[data-td="form-control"]').length).toBe(2);
  });

  test(`Should trigger form submit event`, function() {
    return new Promise((done) => {
      expect.assertions(1);

      const form = new Form(document.body, {buttonText: 'myButton',
        linkCreator: (slot)=>{
          new Link(slot, 'myLink');
        }});

      form.onSubmit((formData) => {
        expect(!!formData).toBeTruthy();
        done();
      });

      document.body.querySelector('[data-td="button-component"]').click();
    });
  });
});
