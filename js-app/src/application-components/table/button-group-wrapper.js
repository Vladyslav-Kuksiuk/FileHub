import {ButtonGroup} from '../../components/button-group';
import {inject} from '../../registry';
import {StateAwareWrapper} from '../state-aware-wrapper';
import {Button, BUTTON_TYPE} from '../../components/button';
import {DefineRemovingItemAction} from '../../state-management/folder/define-removing-item-action';
import {FolderContentItem} from '../../state-management/folder/folder-content-item';
import {UploadFilesAction} from '../../state-management/folder/upload-files-action';

/**
 * ButtonGroup wrapper for state change listening.
 */
export class ButtonGroupWrapper extends StateAwareWrapper {
    @inject stateManagementService;

    /**
     * Adds state listeners to ButtonGroup component.
     *
     * @param {ButtonGroup} buttonGroup
     */
    wrap(buttonGroup) {
      this.addStateListener('folderInfo', (state) => {
        const buttonCreators = [];
        if (state.folderInfo) {
          if (state.folderInfo.id !== state.userProfile.rootFolderId) {
            buttonCreators.push((slot)=>{
              const button = new Button(slot, {
                text: '<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>',
                title: 'Delete this folder',
                type: BUTTON_TYPE.DANGER,
              });
              button.onClick(() => {
                this.stateManagementService.dispatch(new DefineRemovingItemAction(
                    new FolderContentItem('folder',
                        state.folderInfo.id,
                        state.folderInfo.name,
                        null,
                        state.folderInfo.parentId),
                ));
              });
            });
          }
          buttonCreators.push((slot) => {
            const button = new Button(slot, {
              text: '<span aria-hidden="true" class="glyphicon glyphicon-upload"></span>',
              title: 'Upload file',
              type: BUTTON_TYPE.PRIMARY,
            });

            button.onClick(()=>{
              const input = document.createElement('input');
              input.type = 'file';
              input.setAttribute('multiple', '');
              input.click();
              input.addEventListener('change', ()=>{
                this.stateManagementService.dispatch(
                    new UploadFilesAction(
                        state.folderInfo.id,
                        input.files));
              });
            });

            this.addStateListener('foldersToUpload', (state) => {
              if (state.foldersToUpload.includes(state.folderInfo?.id)) {
                button.isDisabled = true;
                button.text = '<span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>';
              } else {
                button.isDisabled = false;
                button.text = '<span aria-hidden="true" class="glyphicon glyphicon-upload"></span>';
              }
            });
          });
          buttonCreators.push((slot) => {
            new Button(slot, {
              text: '<span aria-hidden="true" class="glyphicon glyphicon-plus"></span>',
              title: 'Add folder',
              type: BUTTON_TYPE.PRIMARY,
            });
          });
        }
        buttonGroup.buttonCreators = buttonCreators;
      });

      this.addStateListener('filesUploadingErrorInfo', (state) => {
        buttonGroup.error = state.filesUploadingErrorInfo[state.folderInfo?.id] ?? null;
      });
    }
}
