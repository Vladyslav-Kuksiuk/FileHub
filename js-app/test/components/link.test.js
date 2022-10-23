import {Link} from '../../src/components/link';

describe('Link Component', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`Link constructor`, function() {
    expect.assertions(2);

    const linkText = 'myLink';
    new Link(document.body, linkText);

    expect(document.body.querySelectorAll('[data-td="link-component"]').length).toBe(1);
    expect(document.body.querySelector('[data-td="link-component"]').textContent).toBe(linkText);
  });

  test('onClick', function() {
    expect.assertions(2);

    const link = new Link(document.body, 'myLink');

    let isClicked = false;
    link.onClick(()=>{
      isClicked = true;
    });

    expect(isClicked).toBe(false);
    document.body.querySelector('[data-td="link-component"]').click();
    expect(isClicked).toBe(true);
  });
});
