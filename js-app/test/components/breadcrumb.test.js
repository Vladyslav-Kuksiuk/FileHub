import {Breadcrumb} from '../../src/components/breadcrumb';
import {jest} from '@jest/globals';

describe('Breadcrumb', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should render Breadcrumb component with one path element`, function() {
    expect.assertions(2);

    const path = [{name: 'Home'}];
    new Breadcrumb(document.body, false, false, path);

    expect(document.body.querySelectorAll('ul li').length).toBe(1);
    expect(document.body.querySelector('ul li').textContent).toBe(path[0].name);
  });

  test(`Should render Breadcrumb component with three path element`, function() {
    expect.assertions(6);

    const path = [
      {name: 'folder1', linkListener: jest.fn()},
      {name: 'folder2', linkListener: jest.fn()},
      {name: 'folder3'},
    ];
    new Breadcrumb(document.body, false, false, path);

    expect(document.body.querySelectorAll('ul li').length).toBe(3);
    expect(document.body.querySelectorAll('ul li a')[0].textContent).toBe(path[0].name);
    document.body.querySelectorAll('ul li a')[0].click();
    expect(path[0].linkListener).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll('ul li a')[1].textContent).toBe(path[1].name);
    document.body.querySelectorAll('ul li a')[1].click();
    expect(path[1].linkListener).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll('ul li')[2].textContent).toBe(path[2].name);
  });

  test(`Should render Breadcrumb component with loading`, function() {
    expect.assertions(1);

    new Breadcrumb(document.body, true, false, []);
    expect(document.body.querySelectorAll('[data-td="breadcrumb-loading"]').length).toBe(1);
  });

  test(`Should render Breadcrumb component with error`, function() {
    expect.assertions(1);

    new Breadcrumb(document.body, false, true, []);
    expect(document.body.querySelectorAll('[data-td="breadcrumb-error"]').length).toBe(1);
  });
});
