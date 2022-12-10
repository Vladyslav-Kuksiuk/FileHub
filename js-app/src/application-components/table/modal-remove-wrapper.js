import {ModalRemove} from '../../components/modal-remove';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {DeleteItemAction} from '../../state-management/folder/delete-item-action';
import {inject} from '../../registry';
import {StateAwareWrapper} from '../state-aware-wrapper';

/**
 * ModalRemove wrapper for state change listening.
 */
export class ModalRemoveWrapper extends StateAwareWrapper {
  @inject stateManagementService;

  /**
   * Adds state listeners to ModalRemove component.
   *
   * @param {ModalRemove} modal
   */
  wrap(modal) {
    this.addStateListener('itemInRemovingState', (state) => {
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

    this.addStateListener('isItemDeleting', (state) => {
      modal.isLoading = state.isItemDeleting;
    });

    this.addStateListener('itemDeletingError', (state) => {
      modal.error = state.itemDeletingError;
    });

    modal.onCancel(()=>{
      this.stateManagementService.dispatch(new DefineRemovingItemAction(null));
    });

    modal.onDelete(()=>{
      this.stateManagementService.dispatch(
          new DeleteItemAction(this.stateManagementService.state.itemInRemovingState));
    });
  }
}

