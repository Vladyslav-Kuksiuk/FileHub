import {FolderRow} from '../../src/components/file-list/folder-row';
import {clearRegistry, registry} from '../../src/registry';
import {jest} from '@jest/globals';

describe('FolderRow', () => {
  beforeEach(()=>{
    clearRegistry();
    registry.register('fileTypeIconFactory', ()=>{
      return {
        getIcon: ()=>{},
      };
    });

    document.body.innerHTML = '';
  });

  test(`Should create and render FolderRow component`, function() {
    expect.assertions(1);

    const name = 'myName';
    new FolderRow(document.body, name);

    expect(document.body.innerHTML).toBe(
        `<tr class="folder-row">
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon undefined"></span>
        </td>\n`+
        '        <td class="cell-name"><slot data-td="folder-link-slot"><a class="form-link"' +
        ' data-td="link-component" href="#" title="myName">myName</a></slot></td>' +
        `
        <td class="cell-type">Folder</td>
        <td class="cell-size">—</td>
        <td class="cell-buttons">
            <div class="data-buttons-container">
                
        <button data-td="upload-button" class="icon-button" title="Upload file.">
            <span aria-hidden="true" class="glyphicon glyphicon-upload"></span>
        </button>
                <button data-td="remove-button" class="icon-button" title="Delete">
                    <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
                </button>
            </div>
        </td>
    </tr>`);
  });

  test(`Should render FolderRow component in uploading state`, function() {
    expect.assertions(1);

    const name = 'myName';
    const folderRow = new FolderRow(document.body, name);
    folderRow.isUploading = true;

    expect(document.body.innerHTML).toBe(
        `<tr class="folder-row">
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon undefined"></span>
        </td>\n`+
        '        <td class="cell-name"><slot data-td="folder-link-slot"><a class="form-link"' +
        ' data-td="link-component" href="#" title="myName">myName</a></slot></td>' +
        `
        <td class="cell-type">Folder</td>
        <td class="cell-size">—</td>
        <td class="cell-buttons">
            <div class="data-buttons-container">
                
      <button data-td="upload-button" disabled="" class="icon-button" title="File uploading...">
         <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </button>
                <button data-td="remove-button" class="icon-button" title="Delete">
                    <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
                </button>
            </div>
        </td>
    </tr>`);
  });

  test(`Should render FolderRow component in uploading error state`, function() {
    expect.assertions(1);

    const name = 'myName';
    const folderRow = new FolderRow(document.body, name);
    folderRow.uploadingError = 'error';

    expect(document.body.innerHTML).toBe(
        `<tr class="folder-row">
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon undefined"></span>
        </td>\n`+
        '        <td class="cell-name"><slot data-td="folder-link-slot"><a class="form-link"' +
        ' data-td="link-component" href="#" title="myName">myName</a></slot></td>' +
        `
        <td class="cell-type">Folder</td>
        <td class="cell-size">—</td>
        <td class="cell-buttons">
            <div class="data-buttons-container">
                
        <button data-td="upload-button" class="icon-button" title="error">
            <span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>
        </button>
                <button data-td="remove-button" class="icon-button" title="Delete">
                    <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
                </button>
            </div>
        </td>
    </tr>`);
  });

  test('Should trigger upload click event', function() {
    expect.assertions(1);

    const listenerMock = jest.fn();

    const folderRow = new FolderRow(document.body, 'name');
    folderRow.onUpload(listenerMock);

    document.body.querySelector('[data-td="upload-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger remove click event', function() {
    expect.assertions(1);

    const listenerMock = jest.fn();

    const folderRow = new FolderRow(document.body, 'name');
    folderRow.onRemove(listenerMock);

    document.body.querySelector('[data-td="remove-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger name link click event', function() {
    expect.assertions(1);

    const listenerMock = jest.fn();

    const folderRow = new FolderRow(document.body, 'name');
    folderRow.onFolderLinkClick(listenerMock);

    document.body.querySelector('[data-td="folder-link-slot"] a').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});
