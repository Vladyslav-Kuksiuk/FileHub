import {FileRow} from '../../src/components/file-list/file-row';
import {clearRegistry, registry} from '../../src/registry';
import {jest} from '@jest/globals';

describe('FileRow', () => {
  beforeEach(()=>{
    clearRegistry();
    registry.register('fileTypeFactory', ()=>{
      return {
        getType: ()=>{},
      };
    });
    document.body.innerHTML = '';
  });

  test(`Should create and render FileRow component`, function() {
    expect.assertions(1);

    const name = 'myName';
    const type = 'myType';
    const size = 1;
    new FileRow(document.body, name, type, size);

    expect(document.body.innerHTML).toBe(
        `<tr>
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon undefined"></span>
       </td>
       <td class="cell-name" data-td="name-cell">${name}</td>
       <td class="cell-type">undefined</td>
       <td class="cell-size">1.0 B</td>
       <td class="cell-buttons">
           <div class="data-buttons-container">
               
        <button data-td="download-button" class="icon-button" title="Download file.">
            <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
        </button>
               <button data-td="remove-button" class="icon-button" title="Delete">
                   <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
               </button>
           </div>
       </td>
    </tr>`);
  });

  test(`Should create and render FileRow component in downloading state`, function() {
    expect.assertions(1);

    const name = 'myName';
    const type = 'myType';
    const size = 1;
    const fileRow = new FileRow(document.body, name, type, size);
    fileRow.isDownloading = true;

    expect(document.body.querySelector('[data-td="download-button"]').innerHTML.trim()).toBe(
        `<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>`);
  });

  test(`Should create and render FileRow component in download error state`, function() {
    expect.assertions(1);

    const name = 'myName';
    const type = 'myType';
    const size = 1;
    const fileRow = new FileRow(document.body, name, type, size);
    fileRow.downloadingError = 'error';

    expect(document.body.querySelector('[data-td="download-button"]').innerHTML.trim()).toBe(
        `<span aria-hidden="true" class="glyphicon glyphicon-exclamation-sign"></span>`);
  });

  test(`Should create and render FileRow component in renameFormOpen state with errors`, function() {
    expect.assertions(1);

    const name = 'myName';
    const type = 'type';
    const size = 1;
    const fileRow = new FileRow(document.body, name, type, size);
    fileRow.isRenameFormOpen = true;
    fileRow.renamingErrors = ['error'];

    expect(document.body.innerHTML).toBe(
        `<tr>
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon undefined"></span>
       </td>
       <td class="cell-name" data-td="name-cell">
      <form class="name-edit-form">\n`+
        '          <input class="form-control input-error" name="renameField" placeholder="Enter file name..."' +
        ' type="text" value="myName" data-td="rename-input">\n' +
        `          <p class="help-block text-danger">error</p>
      </form> </td>
       <td class="cell-type">undefined</td>
       <td class="cell-size">1.0 B</td>
       <td class="cell-buttons">
           <div class="data-buttons-container">
               
        <button data-td="download-button" class="icon-button" title="Download file.">
            <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
        </button>
               <button data-td="remove-button" class="icon-button" title="Delete">
                   <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
               </button>
           </div>
       </td>
    </tr>`);
  });

  test(`Should create and render FileRow component in renaming state`, function() {
    expect.assertions(1);

    const name = 'myName';
    const type = 'type';
    const size = 1;
    const fileRow = new FileRow(document.body, name, type, size);
    fileRow.isRenaming = true;

    expect(document.body.innerHTML).toBe(
        `<tr>
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon undefined"></span>
       </td>
       <td class="cell-name" data-td="name-cell">
      <form class="name-edit-form">\n`+
        '          <input class="form-control" disabled="" ' +
        'placeholder="Enter file name..."' +
        ' type="text" value="myName">\n' +
        `          <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>
      </form>
      </td>
       <td class="cell-type">undefined</td>
       <td class="cell-size">1.0 B</td>
       <td class="cell-buttons">
           <div class="data-buttons-container">
               
        <button data-td="download-button" class="icon-button" title="Download file.">
            <span aria-hidden="true" class="glyphicon glyphicon-download"></span>
        </button>
               <button data-td="remove-button" class="icon-button" title="Delete">
                   <span aria-hidden="true" class="glyphicon glyphicon-remove-circle"></span>
               </button>
           </div>
       </td>
    </tr>`);
  });

  test('Should trigger download click event', function() {
    expect.assertions(1);

    const listenerMock = jest.fn();

    const fileRow = new FileRow(document.body, 'name', 'type', 1);
    fileRow.onDownload(listenerMock);

    document.body.querySelector('[data-td="download-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger remove click event', function() {
    expect.assertions(1);

    const listenerMock = jest.fn();

    const fileRow = new FileRow(document.body, 'name', 'type', 10000);
    fileRow.onRemove(listenerMock);

    document.body.querySelector('[data-td="remove-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should open and close renaming form by blur', () => {
    expect.assertions(2);

    const fileRow = new FileRow(document.body, 'name', 'type', 1);
    const openFormListener = jest.fn();

    fileRow.onRenameFormOpen(openFormListener);

    const nameCell = document.body.querySelector('[data-td="name-cell"]');
    nameCell.dispatchEvent(new Event('dblclick'));
    expect(openFormListener).toHaveBeenCalledTimes(1);
    fileRow.isRenameFormOpen = true;

    const input = document.body.querySelector('[data-td="rename-input"]');
    input.dispatchEvent(new Event('blur'));

    expect(document.body.querySelectorAll('[data-td="rename-input"]').length)
        .toBe(0);
  });

  test('Should open and close renaming form by submitting without changes', () => {
    expect.assertions(2);

    const fileRow = new FileRow(document.body, 'name', 'type', 1);
    const openFormListener = jest.fn();

    fileRow.onRenameFormOpen(openFormListener);

    const nameCell = document.body.querySelector('[data-td="name-cell"]');
    nameCell.dispatchEvent(new Event('dblclick'));
    expect(openFormListener).toHaveBeenCalledTimes(1);
    fileRow.isRenameFormOpen = true;

    const form = document.body.querySelector('[data-td="rename-input"]').parentElement;
    form.dispatchEvent(new Event('submit'));

    expect(document.body.querySelectorAll('[data-td="rename-input"]').length)
        .toBe(0);
  });

  test('Shouldn`t open renaming form if it is already open', () => {
    expect.assertions(1);

    const fileRow = new FileRow(document.body, 'name', 'type', 1);
    const openFormListener = jest.fn();

    fileRow.onRenameFormOpen(openFormListener);

    const nameCell = document.body.querySelector('[data-td="name-cell"]');
    fileRow.isRenameFormOpen = true;
    nameCell.dispatchEvent(new Event('dblclick'));
    expect(openFormListener).toHaveBeenCalledTimes(0);
  });

  test('Should submit renaming form on change', () => {
    expect.assertions(2);

    const newName = 'newName';
    const fileRow = new FileRow(document.body, 'name', 'type', 1);
    const renameListener = jest.fn();

    fileRow.onRename(renameListener);

    fileRow.isRenameFormOpen = false;
    fileRow.isRenameFormOpen = true;

    const input = document.body.querySelector('[data-td="rename-input"]');
    input.value = newName;
    input.dispatchEvent(new Event('change'));

    expect(renameListener).toHaveBeenCalledTimes(1);
    expect(renameListener).toHaveBeenCalledWith(newName);
  });

  test('Shouldn`t trigger blur and submit event after change event', () => {
    expect.assertions(1);

    const fileRow = new FileRow(document.body, 'name', 'type', 1);
    const openFormListener = jest.fn();

    fileRow.onRenameFormOpen(openFormListener);

    fileRow.isRenameFormOpen = true;
    const input = document.body.querySelector('[data-td="rename-input"]');
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));

    expect((document.body.querySelectorAll('[data-td="rename-input"]').length)).toBe(1);
  });
});
