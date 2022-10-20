import {Form} from '../../src/components/form';
import {FormControl} from '../../src/components/form-control';
import {Link} from '../../src/components/link';

describe('Form Component', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`Form constructor`, function() {
    expect.assertions(4);

    expect(document.body.querySelectorAll('[data-td="form-component"]').length).toBe(0);

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

  test(`addFormControl`, function() {
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

  test(`onSubmit`, function() {
    expect.assertions(2);

    const form = new Form(document.body, {buttonText: 'myButton',
      linkCreator: (slot)=>{
        new Link(slot, 'myLink');
      }});

    let isSubmitted = false;
    form.onSubmit((formData) => {
      isSubmitted = !!formData;
    });

    expect(isSubmitted).toBe(false);
    document.body.querySelector('[data-td="button-component"]').click();
    expect(isSubmitted).toBe(true);
  });
});
