import {FileList} from '../../src/components/file-list';
import {jest} from '@jest/globals';
import {clearRegistry} from '../../src/registry';
import {registry} from '../../src/registry';

describe('FileList', () => {
  beforeEach(() => {
    clearRegistry();
    document.body.innerHTML = '';
    registry.register('fileTypeIconFactory', ()=>{
      return {
        getIcon: ()=>{},
      };
    });
  });

  test(`Should  call folderCreators and fileCreators`, function() {
    expect.assertions(2);

    const folderCreator = jest.fn();
    const fileCreator = jest.fn();

    const fileList = new FileList(document.body, false, false);
    fileList.setContent([folderCreator], [fileCreator]);

    expect(folderCreator).toHaveBeenCalledTimes(1);
    expect(fileCreator).toHaveBeenCalledTimes(1);
  });

  test(`Should render FolderContent component with loading`, function() {
    expect.assertions(1);

    new FileList(document.body, true, false, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-loading"]').length).toBe(1);
  });

  test(`Should render FolderContent component with error`, function() {
    expect.assertions(1);

    new FileList(document.body, false, true, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-error"]').length).toBe(1);
  });

  test(`Should render FolderContent empty state`, function() {
    expect.assertions(1);

    new FileList(document.body, false, false, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-empty"]').length).toBe(1);
  });

  test('Should change states empty->loading->error', function() {
    expect.assertions(3);
    const folderContent = new FileList(document.body, false, false, [], []);
    expect(document.body.querySelectorAll('[data-td="folder-content-empty"]').length).toBe(1);

    folderContent.isLoading = true;
    expect(document.body.querySelectorAll('[data-td="folder-content-loading"]').length).toBe(1);

    folderContent.isLoading = false;
    folderContent.hasError = true;
    expect(document.body.querySelectorAll('[data-td="folder-content-error"]').length).toBe(1);
  } );
});
