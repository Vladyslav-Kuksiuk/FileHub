import {StorageService} from '../src/storage-service';

describe('Storage service', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test(`Should put key-value to localStorage`, function() {
    expect.assertions(1);
    const storageService = new StorageService();
    const key = 'key';
    const value = 'value';
    storageService.put(key, value);

    expect(window.localStorage.getItem(key)).toBe(value);
  });

  test(`Should get value by key from localStorage`, function() {
    expect.assertions(1);
    const storageService = new StorageService();
    const key = 'key';
    const value = 'value';
    window.localStorage.setItem(key, value);

    expect(storageService.get(key)).toBe(value);
  });

  test(`Should clear localStorage`, function() {
    expect.assertions(1);
    const storage = new StorageService();
    const key = 'key';
    storage.put(key, 'value');

    storage.clear();

    expect(storage.get(key)).toBeNull();
  });
});
