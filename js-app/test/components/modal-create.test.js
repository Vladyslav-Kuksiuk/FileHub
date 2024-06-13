import {ModalCreate} from '../../src/components/modal-create';
import {jest} from '@jest/globals';

describe('ModalCreate', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Should render ModalCreate component', function() {
    expect.assertions(6);
    new ModalCreate(document.body, null);

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');

    expect(modalHTML).toBeDefined();
    expect(modalHTML.getAttribute('style')).toBe('display: none');
    expect(modalHTML.querySelector('h3').textContent.trim()).toBe('Create New Directory');
    expect(modalHTML.querySelectorAll('[data-td="name-input"]').length).toBe(1);
    expect(modalHTML.querySelectorAll('button')[0].textContent.trim()).toBe('Cancel');
    expect(modalHTML.querySelectorAll('button')[1].textContent.trim()).toBe('Create');
  });

  test('Should change hidden state', function() {
    expect.assertions(1);
    const modalComponent = new ModalCreate(document.body, null);
    modalComponent.isHidden = false;

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');
    expect(modalHTML.getAttribute('style')).toBe('display: unset');
  });

  test('Should render error', function() {
    expect.assertions(1);
    const modalComponent = new ModalCreate(document.body, null);
    modalComponent.error = 'error';

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');
    expect(modalHTML.querySelector('p[class="help-block text-danger"]').textContent.trim())
        .toBe('error');
  });

  test('Should change loading state', function() {
    expect.assertions(4);
    const modalComponent = new ModalCreate(document.body, null);
    modalComponent.isLoading = true;

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');
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

  test('Should trigger create event', function() {
    expect.assertions(1);
    const modalComponent = new ModalCreate(document.body, null);
    const listenerMock = jest.fn();
    modalComponent.onCreate(listenerMock);

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');
    modalHTML.querySelector('[data-td="name-input"]').value = '123';
    modalHTML.querySelectorAll('button')[1].click();
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Shouldn`t trigger create event because input is empty', function() {
    expect.assertions(1);
    const modalComponent = new ModalCreate(document.body, null);
    const listenerMock = jest.fn();
    modalComponent.onCreate(listenerMock);

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');
    modalHTML.querySelectorAll('button')[1].click();
    expect(listenerMock).toHaveBeenCalledTimes(0);
  });

  test('Should trigger cancel event on button click', function() {
    expect.assertions(1);
    const modalComponent = new ModalCreate(document.body, null);
    const listenerMock = jest.fn();
    modalComponent.onCancel(listenerMock);

    const modalHTML = document.body.querySelector('[data-td="modal-create-component"]');
    modalHTML.querySelectorAll('button')[0].click();
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });

  test('Should trigger cancel event on cross click', function() {
    expect.assertions(1);
    const modalComponent = new ModalCreate(document.body, null);
    const listenerMock = jest.fn();
    modalComponent.onCancel(listenerMock);

    document.body.querySelector('[data-td="close-cross"]').click();
    expect(listenerMock).toHaveBeenCalledTimes(1);
  });
});
