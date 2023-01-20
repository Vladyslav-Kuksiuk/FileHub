import {jest} from '@jest/globals';
import {clearRegistry, registry} from '../../../src/registry';
import {SearchRowWrapper} from '../../../src/application-components/table/search-row-wrapper';
import {SearchRow} from '../../../src/components/search-row';

describe('SearchRowWrapper', () => {
  let stateListeners = {};
  let stateManagementService;

  beforeEach(() => {
    clearRegistry();
    const dispatchMock = jest.fn();
    stateListeners = {};
    stateManagementService = {
      addStateListener: (field, listener)=>{
        stateListeners[field] = listener;
        return {
          field: field,
          listener: listener,
        };
      },
      dispatch: dispatchMock,
    };

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });
  });

  test(`Should add state listeners`, function() {
    expect.assertions(4);

    const wrapper = new SearchRowWrapper();
    const searchRow = new SearchRow(document.body);

    const isLoadingMock = jest.spyOn(searchRow, 'isLoading', 'set').mockImplementation(()=>{});
    const errorMock = jest.spyOn(searchRow, 'error', 'set').mockImplementation(()=>{});

    wrapper.wrap(searchRow);
    expect(Object.keys(stateListeners)).toContain('folderInfo');
    expect(Object.keys(stateListeners)).toContain('folderContent');

    stateListeners.folderInfo?.({});
    stateListeners.folderContent?.({
      folderInfo: {},
    });

    expect(isLoadingMock).toHaveBeenCalledTimes(1);
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  test('Should call searchRedirectListener', () => {
    const wrapper = new SearchRowWrapper();
    const searchInput = 'searchInput';
    const id = 'id';
    let searchListener;
    const searchRedirectMock = jest.fn();
    const searchRow = {
      onSearchClick: (listener) => {
        searchListener = listener;
      },
    };

    stateManagementService.state = {
      locationMetadata: {
        search: null,
        folderId: id,
      },
    };

    wrapper.wrap(searchRow, searchRedirectMock);

    searchListener(searchInput);

    expect(searchRedirectMock).toHaveBeenCalledTimes(1);
    expect(searchRedirectMock).toHaveBeenCalledWith(id, searchInput);
  });

  test('Should call searchRedirectListener with empty searchInput', () => {
    const wrapper = new SearchRowWrapper();
    const searchInput = '';
    const id = 'id';
    let searchListener;
    const searchRedirectMock = jest.fn();
    const searchRow = {
      onSearchClick: (listener) => {
        searchListener = listener;
      },
    };

    stateManagementService.state = {
      locationMetadata: {
        search: 'hello',
        folderId: id,
      },
    };

    wrapper.wrap(searchRow, searchRedirectMock);

    searchListener(searchInput);

    expect(searchRedirectMock).toHaveBeenCalledTimes(1);
    expect(searchRedirectMock).toHaveBeenCalledWith(id, searchInput);
  });

  test('Should set error to search row', () => {
    const wrapper = new SearchRowWrapper();
    const searchInput = '12';
    const id = 'id';
    let searchListener;
    const searchRedirectMock = jest.fn();
    const searchRow = {
      onSearchClick: (listener) => {
        searchListener = listener;
      },
    };

    stateManagementService.state = {
      locationMetadata: {
        search: null,
        folderId: id,
      },
    };

    wrapper.wrap(searchRow, searchRedirectMock);

    searchListener(searchInput);

    expect(searchRow.error).toBe('Please, enter more then 3 symbols');
    expect(searchRedirectMock).toHaveBeenCalledTimes(0);
  });
});
