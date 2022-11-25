import {ModalRemove} from '../../components/modal-remove';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {DeleteItemAction} from '../../state-management/folder/delete-item-action';
import {inject} from '../../registry';

/**
 * ModalRemove wrapper for state change listening.
 */
export class ModalRemoveWrapper {
  #stateListeners = [];
  @inject #stateManagementService;

  /**
   * Adds state listeners to ModalRemove component.
   *
   * @param {ModalRemove} modal
   */
  wrap(modal) {
    const itemInRemovingStateListener = this.#stateManagementService
        .addStateListener('itemInRemovingState', (state) => {
          if (state.itemInRemovingState) {
            modal.itemName = state.itemInRemovingState.name;
            if (state.itemInRemovingState.type === 'folder') {
              modal.itemType = 'Folder';
            } else {
              modal.itemType = 'File';
            }
            modal.isHidden = false;
          } else {
            modal.isHidden = true;
          }
        });
    this.#stateListeners.push(itemInRemovingStateListener);

    const isItemDeletingListener = this.#stateManagementService
        .addStateListener('isItemDeleting', (state) => {
          modal.isLoading = state.isItemDeleting;
        });
    this.#stateListeners.push(isItemDeletingListener);

    const itemDeletingErrorListener = this.#stateManagementService
        .addStateListener('itemDeletingError', (state) => {
          modal.error = state.itemDeletingError;
        });
    this.#stateListeners.push(itemDeletingErrorListener);

    modal.onCancel(()=>{
      this.#stateManagementService.dispatch(new DefineRemovingItemAction(null));
    });

    modal.onDelete(()=>{
      this.#stateManagementService.dispatch(
          new DeleteItemAction(this.#stateManagementService.state.itemInRemovingState));
    });
  }

  /**
   * Deletes all created state listeners.
   */
  removeStateListeners() {
    this.#stateListeners.forEach((stateListener) => {
      this.#stateManagementService.removeStateListener(stateListener.field, stateListener.listener);
    });
  }
}

