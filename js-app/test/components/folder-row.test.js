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
            <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
        </td>\n`+
        '        <td class="cell-name" data-td="name-cell"><slot data-td="folder-link-slot"><a class="form-link"' +
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
            <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
        </td>\n`+
        '        <td class="cell-name" data-td="name-cell"><slot data-td="folder-link-slot"><a class="form-link"' +
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
            <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
        </td>\n`+
        '        <td class="cell-name" data-td="name-cell"><slot data-td="folder-link-slot"><a class="form-link"' +
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

  test(`Should create and render FolderRow component in renameFormOpen state with errors`, function() {
    expect.assertions(1);

    const name = 'myName';
    const folderRow = new FolderRow(document.body, name);
    folderRow.isRenameFormOpen = true;
    folderRow.renamingErrors = ['error'];

    expect(document.body.innerHTML).toBe(
        `<tr class="folder-row">
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
        </td>
        <td class="cell-name" data-td="name-cell">
      <form class="name-edit-form">\n`+
        '          <input class="form-control input-error" name="renameField" placeholder="Enter file name..."' +
        ' type="text" value="myName" data-td="rename-input">\n' +
      `          <p class="help-block text-danger">error</p>
      </form> </td>
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

  test(`Should create and render FolderRow component in renaming state`, function() {
    expect.assertions(1);

    const name = 'myName';
    const folderRow = new FolderRow(document.body, name);
    folderRow.isRenaming = true;

    expect(document.body.innerHTML).toBe(
        `<tr class="folder-row">
        <td class="cell-arrow">
            <span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>
        </td>
        <td class="cell-icon">
            <span aria-hidden="true" class="glyphicon glyphicon-folder-close"></span>
        </td>
        <td class="cell-name" data-td="name-cell">
      <form class="name-edit-form">\n`+
        '          <input class="form-control" disabled="" ' +
        'placeholder="Enter file name..."' +
        ' type="text" value="myName">\n' +
        `          <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </form></td>
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

  test('Should open and close renaming form by blur', () => {
    expect.assertions(2);

    const folderRow = new FolderRow(document.body, 'name');
    const openFormListener = jest.fn();

    folderRow.onRenameFormOpen(openFormListener);

    const nameCell = document.body.querySelector('[data-td="name-cell"]');
    nameCell.dispatchEvent(new Event('dblclick'));
    expect(openFormListener).toHaveBeenCalledTimes(1);
    folderRow.isRenameFormOpen = true;

    const input = document.body.querySelector('[data-td="rename-input"]');
    input.dispatchEvent(new Event('blur'));

    expect(document.body.querySelectorAll('[data-td="rename-input"]').length)
        .toBe(0);
  });

  test('Should open and close renaming form by submitting without changes', () => {
    expect.assertions(2);

    const folderRow = new FolderRow(document.body, 'name');
    const openFormListener = jest.fn();

    folderRow.onRenameFormOpen(openFormListener);

    const nameCell = document.body.querySelector('[data-td="name-cell"]');
    nameCell.dispatchEvent(new Event('dblclick'));
    expect(openFormListener).toHaveBeenCalledTimes(1);
    folderRow.isRenameFormOpen = true;

    const form = document.body.querySelector('[data-td="rename-input"]').parentElement;
    form.dispatchEvent(new Event('submit'));

    expect(document.body.querySelectorAll('[data-td="rename-input"]').length)
        .toBe(0);
  });

  test('Shouldn`t open renaming form if it is already open', () => {
    expect.assertions(1);

    const folderRow = new FolderRow(document.body, 'name');
    const openFormListener = jest.fn();

    folderRow.onRenameFormOpen(openFormListener);

    const nameCell = document.body.querySelector('[data-td="name-cell"]');
    folderRow.isRenameFormOpen = true;
    nameCell.dispatchEvent(new Event('dblclick'));
    expect(openFormListener).toHaveBeenCalledTimes(0);
  });

  test('Should submit renaming form on change', () => {
    expect.assertions(2);

    const newName = 'newName';
    const folderRow = new FolderRow(document.body, 'name');
    const renameListener = jest.fn();

    folderRow.onRename(renameListener);

    folderRow.isRenameFormOpen = false;
    folderRow.isRenameFormOpen = true;

    const input = document.body.querySelector('[data-td="rename-input"]');
    input.value = newName;
    input.dispatchEvent(new Event('change'));

    expect(renameListener).toHaveBeenCalledTimes(1);
    expect(renameListener).toHaveBeenCalledWith(newName);
  });

  test('Shouldn`t trigger blur and submit event after change event', () => {
    expect.assertions(1);

    const folderRow = new FolderRow(document.body, 'name');
    const openFormListener = jest.fn();

    folderRow.onRenameFormOpen(openFormListener);

    folderRow.isRenameFormOpen = true;
    const input = document.body.querySelector('[data-td="rename-input"]');
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));

    expect((document.body.querySelectorAll('[data-td="rename-input"]').length)).toBe(1);
  });
});
