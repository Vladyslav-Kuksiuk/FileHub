import {inject} from '../registry';
import {FolderContentItem} from '../state-management/folder/folder-content-item';
import {ApiServiceError} from './api-service-error';

/**
 * Service to perform file downloading in browser.
 */
export class DownloadService {
    @inject apiService;

    /**
     * Downloads files.
     *
     * @param {FolderContentItem} file
     * @returns {Promise<ApiServiceError>}
     */
    async download(file) {
      this.apiService
          .downloadFile(file.id)
          .then((data) => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(data);
            a.download = file.name;
            a.click();
          });
    }
}
