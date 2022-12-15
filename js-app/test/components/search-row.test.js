import {SearchRow} from '../../src/components/search-row';
import {jest} from '@jest/globals';
describe('SearchRow', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`Should create and render SearchRow component`, function() {
    expect.assertions(1);

    new SearchRow(document.body);

    expect(document.body.innerHTML.replace(/\s+/g, ' ')).toBe(
        `<div>
          <div class="input-group search-line">
            <input data-td="search-input" class="form-control " 
            id="search" name="Search" value="" placeholder="Enter entity name..." type="text">
            <span class="input-group-btn">
              <button data-td="search-button" class="btn btn-primary" title="Search" type="button">
                  Search
              </button>
            </span>
          </div>
        </div>`.replace(/\s+/g, ' '));
  });

  test(`Should render SearchRow component in loading state`, function() {
    expect.assertions(1);

    const searchRow = new SearchRow(document.body);
    searchRow.isLoading = true;

    expect(document.body.innerHTML.replace(/\s+/g, ' ')).toBe(
        `<div>
          <div class="input-group search-line">
            <input data-td="search-input" class="form-control " 
            id="search" name="Search" value="" placeholder="Enter entity name..." type="text" disabled="">
            <span class="input-group-btn">
              <button data-td="search-button" class="btn btn-primary" title="Search" type="button" disabled="">
                  <span aria-hidden="true" class="glyphicon glyphicon-repeat"></span>Search
              </button>
            </span>
          </div>
        </div>`.replace(/\s+/g, ' '));
  });

  test(`Should render SearchRow component in error state`, function() {
    expect.assertions(1);

    const searchRow = new SearchRow(document.body);
    const error = 'error';
    searchRow.error = error;

    expect(document.body.innerHTML.replace(/\s+/g, ' ')).toBe(
        `<div>
          <div class="input-group search-line">
            <input data-td="search-input" class="form-control input-error" 
            id="search" name="Search" value="" placeholder="Enter entity name..." type="text">
            <span class="input-group-btn">
              <button data-td="search-button" class="btn btn-primary" title="Search" type="button">
                  Search
              </button>
            </span>
          </div>
          <p class="help-block text-danger">${error}</p>
        </div>`.replace(/\s+/g, ' '));
  });

  test('Should trigger search event listener with input text', () => {
    expect.assertions(2);

    const searchRow = new SearchRow(document.body);
    const listenerMock = jest.fn();
    const value = 'value';

    searchRow.onSearchClick(listenerMock);

    document.body.querySelector('[data-td="search-input"]').value = value;
    document.body.querySelector('[data-td="search-button"]').click();

    expect(listenerMock).toHaveBeenCalledTimes(1);
    expect(listenerMock).toHaveBeenCalledWith(value);
  });
});
