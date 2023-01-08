import {ModalRemove} from '../../src/components/modal-remove';
import {jest} from '@jest/globals';

describe('ModalRemove', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Should render ModalRemove component', function() {
    expect.assertions(6);
    new ModalRemove(document.body, 'itemName', 'folder', null);

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');

    expect(modalHTML).toBeDefined();
    expect(modalHTML.getAttribute('style')).toBe('display: none');
    expect(modalHTML.querySelector('h3').textContent.trim()).toBe('Delete folder');
    expect(modalHTML.querySelector('p[class="modal-text"]').textContent.trim())
        .toBe('Are you sure you want to delete "itemName"?');
    expect(modalHTML.querySelectorAll('button')[0].textContent.trim()).toBe('Cancel');
    expect(modalHTML.querySelectorAll('button')[1].textContent.trim()).toBe('Delete');
  });

  test('Should change item name', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    modalComponent.itemName = 'new name';

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    expect(modalHTML.querySelector('p[class="modal-text"]').textContent.trim())
        .toBe('Are you sure you want to delete "new name"?');
  });

  test('Should change item type', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    modalComponent.itemType = 'notAFolder';

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    expect(modalHTML.querySelector('h3').textContent.trim()).toBe('Delete notAFolder');
  });

  test('Should change hidden state', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    modalComponent.isHidden = false;

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    expect(modalHTML.getAttribute('style')).toBe('display: unset');
  });

  test('Should render error', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    modalComponent.error = 'error';

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    expect(modalHTML.querySelector('p[class="help-block text-danger"]').textContent.trim())
        .toBe('error');
  });

  test('Should change loading state', function() {
    expect.assertions(4);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    modalComponent.isLoading = true;

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    expect(modalHTML.querySelectorAll('button')[0].getAttribute('disabled'))
        .toBe('');
    expect(modalHTML.querySelectorAll('button')[1].getAttribute('disabled'))
        .toBe('');

    modalComponent.isLoading = false;
    expect(modalHTML.querySelectorAll('button')[0].getAttribute('disabled'))
        .toBeNull();
    expect(modalHTML.querySelectorAll('button')[1].getAttribute('disabled'))
        .toBeNull();
  });

  test('Should trigger delete event', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    const listenerMock = jest.fn();
    modalComponent.onDelete(listenerMock);

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    modalHTML.querySelectorAll('button')[1].click();
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger cancel event on button click', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    const listenerMock = jest.fn();
    modalComponent.onCancel(listenerMock);

    const modalHTML = document.body.querySelector('[data-td="modal-remove-component"]');
    modalHTML.querySelectorAll('button')[0].click();
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger cancel event on cross click', function() {
    expect.assertions(1);
    const modalComponent = new ModalRemove(document.body, 'itemName', 'folder', null);
    const listenerMock = jest.fn();
    modalComponent.onCancel(listenerMock);

    document.body.querySelector('[data-td="close-cross"]').click();
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});
