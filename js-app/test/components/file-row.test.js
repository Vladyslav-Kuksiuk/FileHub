import {FileRow} from '../../src/components/file-list/file-row';
import {clearRegistry, registry} from '../../src/registry';
import {jest} from '@jest/globals';

describe('FileRow', () => {
  let getIconMock;

  beforeEach(()=>{
    clearRegistry();
    getIconMock = jest.fn();

    registry.register('fileTypeIconFactory', ()=>{
      return {
        getIcon: getIconMock,
      };
    });
    document.body.innerHTML = '';
  });

  test(`Should create and render FileRow component`, function() {
    expect.assertions(1);

    const name = 'myName';
    const type = 'myType';
    const size = 'mySize';
    new FileRow(document.body, name, type, size);

    expect(document.body.innerHTML).toBe(
        `<tr>
       <td class="cell-arrow"></td>
       <td class="cell-icon">
           <span aria-hidden="true" class="glyphicon undefined"></span>
       </td>
       <td class="cell-name">${name}</td>
       <td class="cell-type">${type}</td>
       <td class="cell-size">${size}</td>
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

    const fileRow = new FileRow(document.body, 'name', 'type', 'size');
    fileRow.onDownload(listenerMock);

    document.body.querySelector('[data-td="download-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger remove click event', function() {
    expect.assertions(1);

    const listenerMock = jest.fn();

    const fileRow = new FileRow(document.body, 'name', 'type', 'size');
    fileRow.onRemove(listenerMock);

    document.body.querySelector('[data-td="remove-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});
