import {inject} from '../../registry';
import {StateAwareWrapper} from '../state-aware-wrapper';
import {SearchRow} from '../../components/search-row';

/**
 * SearchRow wrapper for state change listening.
 */
export class SearchRowWrapper extends StateAwareWrapper {
    @inject stateManagementService;

    /**
     * Adds state listeners to SearchRow component.
     *
     * @param {SearchRow} searchRow
     * @param {function(string, string)} searchRedirectListener
     */
    wrap(searchRow, searchRedirectListener) {
      this.addStateListener('folderInfo', (state) => {
        searchRow.isLoading = !state.folderInfo;
      });

      searchRow.onSearchClick((searchInput) => {
        const metadata = this.stateManagementService.state.locationMetadata;
        if (searchInput.length === 0 && metadata.search != null) {
          searchRedirectListener(metadata.folderId, '');
          return;
        }

        if (searchInput.length < 3) {
          searchRow.error = 'Please, enter more then 3 symbols';
          return;
        }

        searchRedirectListener(metadata.folderId, searchInput);
      });
    }
}
