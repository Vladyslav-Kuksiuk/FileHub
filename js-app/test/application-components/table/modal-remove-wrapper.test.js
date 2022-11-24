import {ApplicationContext} from '../../../src/application-context';
import {jest} from '@jest/globals';
import {ModalRemove} from '../../../src/components/modal-remove';
import {ModalRemoveWrapper} from '../../../src/application-components/table/modal-remove-wrapper';
import {DeleteItemAction} from '../../../src/state-management/folder/delete-item-action.js';
import {DefineRemovingItemAction} from '../../../src/state-management/folder/define-removing-item-action.js';

describe('ModalRemoveWrapper', () => {
  let applicationContext;
  let stateListeners = {};
  let dispatchMock;

  beforeEach(() => {
    applicationContext = new ApplicationContext();

    stateListeners = {};
    jest.spyOn(applicationContext.stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
          return {
            field: field,
            listener: listener,
          };
        });
    dispatchMock = jest.spyOn(applicationContext.stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should add state listeners and trigger them`, function() {
    expect.assertions(17);

    const wrapper = new ModalRemoveWrapper(applicationContext);
    const modalRemove = new ModalRemove(document.body, 'name', 'type', null);

    const itemTypeMock = jest.spyOn(modalRemove, 'itemType', 'set').mockImplementation(()=>{});
    const itemNameMock = jest.spyOn(modalRemove, 'itemName', 'set').mockImplementation(()=>{});
    const isHiddenMock = jest.spyOn(modalRemove, 'isHidden', 'set').mockImplementation(()=>{});
    const isLoadingMock = jest.spyOn(modalRemove, 'isLoading', 'set').mockImplementation(()=>{});
    const errorMock = jest.spyOn(modalRemove, 'error', 'set').mockImplementation(()=>{});

    wrapper.wrap(modalRemove);
    expect(Object.keys(stateListeners)).toContain('itemInRemovingState');
    expect(Object.keys(stateListeners)).toContain('isItemDeleting');
    expect(Object.keys(stateListeners)).toContain('itemDeletingError');

    const folderInRemovingState = {
      name: 'folderName',
      type: 'folder',
    };

    const fileInRemovingState = {
      name: 'fileName',
      type: 'notAFolder',
    };

    stateListeners.itemInRemovingState({
      itemInRemovingState: folderInRemovingState,
    });

    stateListeners.itemInRemovingState({
      itemInRemovingState: fileInRemovingState,
    });

    stateListeners.itemInRemovingState({
      itemInRemovingState: null,
    });

    expect(itemNameMock).toHaveBeenCalledTimes(2);
    expect(itemNameMock).toHaveBeenNthCalledWith(1, folderInRemovingState.name);
    expect(itemNameMock).toHaveBeenNthCalledWith(2, fileInRemovingState.name);

    expect(itemTypeMock).toHaveBeenCalledTimes(2);
    expect(itemTypeMock).toHaveBeenNthCalledWith(1, 'Folder');
    expect(itemTypeMock).toHaveBeenNthCalledWith(2, 'File');

    expect(isHiddenMock).toHaveBeenCalledTimes(3);
    expect(isHiddenMock).toHaveBeenNthCalledWith(1, false);
    expect(isHiddenMock).toHaveBeenNthCalledWith(2, false);
    expect(isHiddenMock).toHaveBeenNthCalledWith(3, true);

    stateListeners.isItemDeleting({
      isItemDeleting: true,
    });

    expect(isLoadingMock).toHaveBeenCalledTimes(1);
    expect(isLoadingMock).toHaveBeenNthCalledWith(1, true);

    stateListeners.itemDeletingError({
      itemDeletingError: 'error',
    });

    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenNthCalledWith(1, 'error');
  });

  test('Should trigger delete event', ()=>{
    expect.assertions(2);

    const modalWrapper = new ModalRemoveWrapper(applicationContext);
    let onDeleteListener;
    jest.spyOn(applicationContext.stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            itemInRemovingState: {},
          };
        });

    modalWrapper.wrap({
      onDelete: jest.fn((listener)=>{
        onDeleteListener = listener;
      }),
      onCancel: jest.fn(),
    });

    onDeleteListener();

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new DeleteItemAction({}, applicationContext.apiService));
  });

  test('Should trigger cancel event', ()=>{
    expect.assertions(2);

    const modalWrapper = new ModalRemoveWrapper(applicationContext);
    let onCancelListener;

    modalWrapper.wrap({
      onDelete: jest.fn(),
      onCancel: jest.fn((listener)=>{
        onCancelListener = listener;
      }),
    });

    onCancelListener();

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new DefineRemovingItemAction(null));
  });

  test('Should remove state listeners', function() {
    expect.assertions(3);
    const modalWrapper = new ModalRemoveWrapper(applicationContext);
    modalWrapper.wrap({
      onCancel: ()=>{},
      onDelete: ()=>{},
    });

    const removeStateListenersMock = jest.spyOn(
        applicationContext.stateManagementService,
        'removeStateListener')
        .mockImplementation(()=>{});

    modalWrapper.removeStateListeners();

    expect(removeStateListenersMock.mock.calls[0][0]).toBe('itemInRemovingState');
    expect(removeStateListenersMock.mock.calls[1][0]).toBe('isItemDeleting');
    expect(removeStateListenersMock.mock.calls[2][0]).toBe('itemDeletingError');
  });
});
