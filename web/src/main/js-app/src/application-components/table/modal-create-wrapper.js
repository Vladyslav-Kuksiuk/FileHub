import {inject} from '../../registry';
import {ModalCreate} from '../../components/modal-create';
import {ChangeCreationModalAction} from '../../state-management/folder/change-creation-modal-action';
import {CreateFolderAction} from '../../state-management/folder/create-folder-action';
import {StateAwareWrapper} from '../state-aware-wrapper';
import {FolderContentItem} from '../../state-management/folder/folder-content-item';

/**
 * ModalCreate wrapper for state change listening.
 */
export class ModalCreateWrapper extends StateAwareWrapper {
    @inject stateManagementService;

    /**
     * Adds state listeners to ModalCreate component.
     *
     * @param {ModalCreate} modal
     */
    wrap(modal) {
      this.addStateListener('isFolderCreationModalOpen', (state) => {
        modal.isHidden = !state.isFolderCreationModalOpen;
      });

      this.addStateListener('folderInCreationState', (state) => {
        modal.isLoading = !!state.folderInCreationState;
      });

      this.addStateListener('folderCreationError', (state) => {
        modal.error = state.folderCreationError;
      });

      modal.onCancel(()=>{
        this.stateManagementService.dispatch(new ChangeCreationModalAction(false));
      });

      modal.onCreate((name)=>{
        this.stateManagementService.dispatch(
            new CreateFolderAction(new FolderContentItem({
              name: name,
              parentId: this.stateManagementService.state.folderInfo.id,
              type: 'folder',
            })));
      });
    }
}

