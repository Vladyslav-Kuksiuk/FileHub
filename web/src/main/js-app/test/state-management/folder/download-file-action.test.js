import {MUTATOR_NAMES} from '../../../src/state-management/mutators';
import {jest} from '@jest/globals';
import {registry, clearRegistry} from '../../../src/registry';
import {StateManagementService} from '../../../src/state-management/state-management-service';
import {DownloadFileAction} from '../../../src/state-management/folder/download-file-action';

describe('DownloadFilesAction', () => {
  let downloadService;
  let stateManagementService;

  beforeEach(()=>{
    clearRegistry();

    stateManagementService = new StateManagementService({}, {});

    downloadService = {
      download: () => {},
    };

    registry.register('downloadService', () => {
      return downloadService;
    });

    registry.register('stateManagementService', () => {
      return stateManagementService;
    });
  });

  test(`Should return expected successfully sequence of mutator calls`, function() {
    expect.assertions(4);
    const file = {
      id: 'id',
      name: 'name',
    };

    const apiServiceMock = jest
        .spyOn(downloadService, 'download')
        .mockImplementation(async ()=>{});

    const action = new DownloadFileAction(file);

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(2);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.ADD_DOWNLOADING_FILE, file.id);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.REMOVE_DOWNLOADING_FILE, file.id);
    });
  });

  test(`Should return expected failed sequence of mutator calls`, function() {
    expect.assertions(5);
    const file = {
      id: 'id',
      name: 'name',
    };
    const error = 'error';

    const apiServiceMock = jest
        .spyOn(downloadService, 'download')
        .mockImplementation(async ()=>{
          throw new Error(error);
        });
    const action = new DownloadFileAction(file);

    const executor = jest.fn(()=>{});

    return action.execute(executor).then(()=>{
      expect(apiServiceMock).toHaveBeenCalledTimes(1);
      expect(executor).toHaveBeenCalledTimes(3);
      expect(executor).toHaveBeenNthCalledWith(1, MUTATOR_NAMES.ADD_DOWNLOADING_FILE, file.id);
      expect(executor).toHaveBeenNthCalledWith(2, MUTATOR_NAMES.ADD_FILE_DOWNLOADING_ERROR, {
        error: error,
        fileId: file.id,
      });
      expect(executor).toHaveBeenNthCalledWith(3, MUTATOR_NAMES.REMOVE_DOWNLOADING_FILE, file.id);
    });
  });
});
