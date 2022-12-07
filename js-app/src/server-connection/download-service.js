import {inject} from '../registry';
import {FolderContentItem} from '../state-management/folder/folder-content-item';

/**
 * Service to perform file downloading in browser.
 */
export class DownloadService {
    @inject apiService;

    /**
     * Downloads file.
     *
     * @param {FolderContentItem} file
     */
    download(file) {
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
