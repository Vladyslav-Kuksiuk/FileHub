import {Link} from '../../src/components/link';

describe('Link', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`Should create and render Link component`, function() {
    expect.assertions(2);

    const linkText = 'myLink';
    new Link(document.body, linkText);

    expect(document.body.querySelectorAll('[data-td="link-component"]').length).toBe(1);
    expect(document.body.querySelector('[data-td="link-component"]').textContent).toBe(linkText);
  });

  test('Should trigger click event', function() {
    return new Promise((done) => {
      expect.assertions(1);

      const link = new Link(document.body, 'myLink');

      link.onClick(()=>{
        expect(true).toBeTruthy();
        done();
      });

      document.body.querySelector('[data-td="link-component"]').click();
    });
  });
});
