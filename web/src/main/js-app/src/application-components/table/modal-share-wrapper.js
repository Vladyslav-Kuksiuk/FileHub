import {StateAwareWrapper} from "../state-aware-wrapper.js";
import {inject} from "../../registry.js";
import {ModalShare} from "./modal-share.js";
import {DefineSharingFileAction} from "../../state-management/folder/define-sharing-file-action.js";
import {LoadFolderContentAction} from "../../state-management/folder/load-folder-content-action.js";

/**
 * ModalShare wrapper for state change listening.
 */
export class ModalShareWrapper extends StateAwareWrapper {
    @inject stateManagementService;
    @inject apiService;

    /**
     * Adds state listeners to ModalShare component.
     *
     * @param {ModalShare} modal
     */
    wrap(modal) {
        this.addStateListener('fileInSharingState', (state) => {
            let file = state.fileInSharingState
            if (file === null || file === undefined) {
                modal.reload(true, null, null)
            } else {
                modal.reload(false, file.name, file.shareTag)
            }
        });

        modal.onCancel(()=>{
            this.stateManagementService.dispatch(new DefineSharingFileAction(null));
        });

        modal.onShare(()=>{
            this.apiService.shareFile(this.stateManagementService.state.fileInSharingState.id)
                .then((response)=> {
                    modal.reload(false, response.name, response.shareTag)
                    this.stateManagementService.dispatch(
                        new LoadFolderContentAction(this.stateManagementService.state.folderInfo.id));
                })
                .catch((e)=>{
                    console.log(e)
                })
        });

        modal.onStopSharing(()=> {
            this.apiService.stopSharingFile(this.stateManagementService.state.fileInSharingState.id)
                .then((response)=> {
                    modal.reload(false, response.name, response.shareTag)
                    this.stateManagementService.dispatch(
                        new LoadFolderContentAction(this.stateManagementService.state.folderInfo.id));
                })
                .catch((e)=>{
                    console.log(e)
                })
        })
    }
}
