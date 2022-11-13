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

  test('Should change state one folder -> two folders -> error -> loading', function() {
    expect.assertions(5);
    const path1 = [{name: 'Home'}];
    const breadcrumb = new Breadcrumb(document.body, false, false, path1);

    expect(document.body.querySelector('ul li').textContent).toBe(path1[0].name);

    const path2 = [{name: 'Home', linkListener: ()=>{}},
      {name: 'folder2'}];

    breadcrumb.path = path2;
    expect(document.body.querySelector('ul li a').textContent).toBe(path2[0].name);
    expect(document.body.querySelectorAll('ul li')[1].textContent).toBe(path2[1].name);

    breadcrumb.path = [];
    breadcrumb.hasError = true;
    expect(document.body.querySelectorAll('[data-td="breadcrumb-error"]').length).toBe(1);

    breadcrumb.hasError = false;
    breadcrumb.isLoading = true;
    expect(document.body.querySelectorAll('[data-td="breadcrumb-loading"]').length).toBe(1);
  } );
});
