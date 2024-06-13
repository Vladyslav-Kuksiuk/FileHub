import {jest} from '@jest/globals';
import {clearRegistry, registry} from '../../src/registry';
import {DownloadService} from '../../src/server-connection/download-service';

describe('DownloadService', () => {
  let apiService;
  beforeEach(() => {
    clearRegistry();
    window.URL.createObjectURL = jest.fn();
    apiService = {
      downloadFile: async () => {},
    };

    registry.register('apiService', () => {
      return apiService;
    });
  });

  test(`Should successfully download file`, function() {
    return new Promise((done) => {
      expect.assertions(4);

      const file = {
        id: 'id',
        name: 'name',
      };

      const createElementSpy = jest.spyOn(document, 'createElement');
      const downloadFileMock = jest.spyOn(apiService, 'downloadFile')
          .mockImplementation(async ()=>{
            return new Blob();
          });
      const downloadService = new DownloadService();

      downloadService.download(file);

      setTimeout(()=>{
        const a = createElementSpy.mock.results[0].value;
        expect(downloadFileMock).toHaveBeenCalledTimes(1);
        expect(downloadFileMock).toHaveBeenCalledWith(file.id);
        expect(a.download).toBe(file.name);
        expect(window.URL.createObjectURL).toHaveBeenCalledWith(new Blob());
        done();
      });
    },
    );
  },
  );

  test(`Should catch and throw error`, function() {
    expect.assertions(1);

    jest.spyOn(apiService, 'downloadFile')
        .mockImplementation(async () => {
          throw new Error();
        });
    const downloadService = new DownloadService();

    return expect(downloadService.download({})).rejects.toStrictEqual(new Error());
  });
});

