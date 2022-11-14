import {FolderContent} from '../../src/components/folder-content';
import {jest} from '@jest/globals';

describe('FolderContent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test(`Should render FolderContent component with 2 folders and 2 files`, function() {
    expect.assertions(13);

    const folders = [
      {
        name: 'folder1',
        linkListener: jest.fn(),
      },
      {
        name: 'folder2',
        linkListener: jest.fn(),
      },
    ];

    const files = [
      {
        name: 'file1',
        type: 'type1',
        size: 'size1',
      },
      {
        name: 'file2',
        type: 'type2',
        size: 'size2',
      },
    ];
    new FolderContent(document.body, false, false, folders, files);

    expect(document.body.querySelectorAll('tr').length).toBe(4);

    expect(document.body.querySelectorAll('tr')[0].querySelectorAll('td')[2].textContent)
        .toBe(folders[0].name);
    expect(document.body.querySelectorAll('tr')[0].querySelectorAll('td')[3].textContent)
        .toBe('Folder');
    expect(document.body.querySelectorAll('tr')[0].querySelectorAll('td')[4].textContent)
        .toBe('—');

    expect(document.body.querySelectorAll('tr')[1].querySelectorAll('td')[2].textContent)
        .toBe(folders[1].name);
    expect(document.body.querySelectorAll('tr')[1].querySelectorAll('td')[3].textContent)
        .toBe('Folder');
    expect(document.body.querySelectorAll('tr')[1].querySelectorAll('td')[4].textContent)
        .toBe('—');

    expect(document.body.querySelectorAll('tr')[2].querySelectorAll('td')[2].textContent)
        .toBe(files[0].name);
    expect(document.body.querySelectorAll('tr')[2].querySelectorAll('td')[3].textContent)
        .toBe(files[0].type);
    expect(document.body.querySelectorAll('tr')[2].querySelectorAll('td')[4].textContent)
        .toBe(files[0].size);

    expect(document.body.querySelectorAll('tr')[3].querySelectorAll('td')[2].textContent)
        .toBe(files[1].name);
    expect(document.body.querySelectorAll('tr')[3].querySelectorAll('td')[3].textContent)
        .toBe(files[1].type);
    expect(document.body.querySelectorAll('tr')[3].querySelectorAll('td')[4].textContent)
        .toBe(files[1].size);
  });

  test(`Should render FolderContent component with loading`, function() {
    expect.assertions(1);

    new FolderContent(document.body, true, false, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-loading"]').length).toBe(1);
  });

  test(`Should render FolderContent component with error`, function() {
    expect.assertions(1);

    new FolderContent(document.body, false, true, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-error"]').length).toBe(1);
  });

  test(`Should render FolderContent empty state`, function() {
    expect.assertions(1);

    new FolderContent(document.body, false, false, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-empty"]').length).toBe(1);
  });

  test('Should change states empty->loading->error->folder', function() {
    expect.assertions(4);
    const folderContent = new FolderContent(document.body, false, false, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-empty"]').length).toBe(1);

    folderContent.isLoading = true;
    expect(document.body.querySelectorAll('[data-td="folder-content-loading"]').length).toBe(1);

    folderContent.isLoading = false;
    folderContent.hasError = true;
    expect(document.body.querySelectorAll('[data-td="folder-content-error"]').length).toBe(1);

    folderContent.hasError = false;
    folderContent.setContent([{name: 'hello'}], []);
    expect(document.body.querySelectorAll('tr').length).toBe(1);
  } );
});
