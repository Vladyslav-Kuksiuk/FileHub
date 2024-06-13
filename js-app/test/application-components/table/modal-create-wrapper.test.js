import {jest} from '@jest/globals';
import {ModalCreate} from '../../../src/components/modal-create';
import {ModalCreateWrapper} from '../../../src/application-components/table/modal-create-wrapper';
import {CreateFolderAction} from '../../../src/state-management/folder/create-folder-action';
import {clearRegistry, registry} from '../../../src/registry';
import {ApiService} from '../../../src/server-connection/api-service';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {ChangeCreationModalAction} from '../../../src/state-management/folder/change-creation-modal-action';

describe('ModalCreateWrapper', () => {
  let stateManagementService;
  let stateListeners = {};
  let dispatchMock;

  beforeEach(() => {
    clearRegistry();
    const apiService = new ApiService({});
    stateManagementService = new StateManagementService({}, {});

    registry.register('apiService', () => {
      return apiService;
    });

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });

    stateListeners = {};
    jest.spyOn(stateManagementService, 'addStateListener')
        .mockImplementation((field, listener)=>{
          stateListeners[field] = listener;
          return {
            field: field,
            listener: listener,
          };
        });
    dispatchMock = jest.spyOn(stateManagementService, 'dispatch')
        .mockImplementation(()=>{});
  });

  test(`Should add state listeners and trigger them`, function() {
    expect.assertions(10);

    const wrapper = new ModalCreateWrapper();
    const modalCreate = new ModalCreate(document.body, null);

    const isHiddenMock = jest.spyOn(modalCreate, 'isHidden', 'set').mockImplementation(()=>{});
    const isLoadingMock = jest.spyOn(modalCreate, 'isLoading', 'set').mockImplementation(()=>{});
    const errorMock = jest.spyOn(modalCreate, 'error', 'set').mockImplementation(()=>{});

    wrapper.wrap(modalCreate);
    expect(Object.keys(stateListeners)).toContain('folderInCreationState');
    expect(Object.keys(stateListeners)).toContain('isFolderCreationModalOpen');
    expect(Object.keys(stateListeners)).toContain('folderCreationError');

    const folderInCreationState = {
      name: 'folderName',
      parentId: 'parentId',
      type: 'folder',
    };

    stateListeners.isFolderCreationModalOpen({
      isFolderCreationModalOpen: false,
    });

    stateListeners.isFolderCreationModalOpen({
      isFolderCreationModalOpen: true,
    });

    expect(isHiddenMock).toHaveBeenCalledTimes(2);
    expect(isHiddenMock).toHaveBeenNthCalledWith(1, true);
    expect(isHiddenMock).toHaveBeenNthCalledWith(2, false);

    stateListeners.folderInCreationState({
      folderInCreationState: folderInCreationState,
    });

    stateListeners.folderInCreationState({
      folderInCreationState: null,
    });

    expect(isLoadingMock).toHaveBeenCalledTimes(2);
    expect(isLoadingMock).toHaveBeenNthCalledWith(1, true);

    stateListeners.folderCreationError({
      folderCreationError: 'error',
    });

    expect(errorMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenNthCalledWith(1, 'error');
  });

  test('Should trigger create event', ()=>{
    expect.assertions(2);

    const modalWrapper = new ModalCreateWrapper();
    let onCreateListener;
    jest.spyOn(stateManagementService, 'state', 'get')
        .mockImplementation(()=>{
          return {
            isFolderCreationModalOpen: true,
            folderInfo: {
              id: '123',
            },
          };
        });

    modalWrapper.wrap({
      onCreate: jest.fn((listener)=>{
        onCreateListener = listener;
      }),
      onCancel: jest.fn(),
    });

    onCreateListener();

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new CreateFolderAction({}));
  });

  test('Should trigger cancel event', ()=>{
    expect.assertions(2);

    const modalWrapper = new ModalCreateWrapper();
    let onCancelListener;

    modalWrapper.wrap({
      onCreate: jest.fn(),
      onCancel: jest.fn((listener)=>{
        onCancelListener = listener;
      }),
    });

    onCancelListener();

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(new ChangeCreationModalAction(false));
  });

  test('Should remove state listeners', function() {
    expect.assertions(3);
    const modalWrapper = new ModalCreateWrapper();
    modalWrapper.wrap({
      onCancel: ()=>{},
      onCreate: ()=>{},
    });

    const removeStateListenersMock = jest.spyOn(
        stateManagementService,
        'removeStateListener')
        .mockImplementation(()=>{});

    modalWrapper.removeStateListeners();

    expect(removeStateListenersMock.mock.calls[0][0]).toBe('isFolderCreationModalOpen');
    expect(removeStateListenersMock.mock.calls[1][0]).toBe('folderInCreationState');
    expect(removeStateListenersMock.mock.calls[2][0]).toBe('folderCreationError');
  });
});
