import {RouterConfigBuilder} from '../../src/router/router-config';
import {Router} from '../../src/router';
import {jest} from '@jest/globals';

describe('Router', () => {
  const sideEffects = {
    document: {
      addEventListener: {
        fn: document.addEventListener,
        refs: [],
      },
      keys: Object.keys(document),
    },
    window: {
      addEventListener: {
        fn: window.addEventListener,
        refs: [],
      },
      keys: Object.keys(window),
    },
  };

  const routerConfig = new RouterConfigBuilder()
      .addHomeRoutePath('login')
      .addErrorRoute(() => {
        document.body.textContent = 'error';
      })
      .addRoute('register', () => {
        document.body.textContent = 'register';
      })
      .addRoute('login', () => {
        document.body.textContent = 'login';
      }).build();

  beforeAll(()=>{
    ['document', 'window'].forEach((obj) => {
      const fn = sideEffects[obj].addEventListener.fn;
      const refs = sideEffects[obj].addEventListener.refs;

      const addEventListenerSpy = (type, listener, options) => {
        refs.push({type, listener, options});
        fn(type, listener, options);
      };

      sideEffects[obj].keys.push('addEventListener');

      global[obj].addEventListener = addEventListenerSpy;
    });
  });

  beforeEach(()=>{
    ['document', 'window'].forEach((obj) => {
      const refs = sideEffects[obj].addEventListener.refs;

      // Listeners
      while (refs.length) {
        const {type, listener, options} = refs.pop();
        global[obj].removeEventListener(type, listener, options);
      }

      // Keys
      Object.keys(global[obj])
          .filter((key) => !sideEffects[obj].keys.includes(key))
          .forEach((key) => {
            delete global[obj][key];
          });
    });
  });

  test(`Should redirect to login->register->error by hash-changing`, function() {
    return new Promise((done) => {
      expect.assertions(6);

      window.location.hash = '';

      const router = new Router(routerConfig);
      router.handleUrlPath();

      expect(document.body.textContent).toBe('login');
      expect(window.location.hash).toBe('');

      router.redirect('register');

      setTimeout(() => {
        expect(document.body.textContent).toBe('register');
        expect(window.location.hash).toBe('#register');

        router.redirect('notExistingPage');

        setTimeout(() => {
          expect(document.body.textContent).toBe('error');
          expect(window.location.hash).toBe('#notExistingPage');
          done();
        });
      });
    });
  });

  test(`Should redirect to login->register->error by redirect`, function() {
    return new Promise((resolve) => {
      expect.assertions(3);

      window.location.hash = '';

      const router = new Router(routerConfig);
      router.handleUrlPath();

      expect(document.body.textContent).toBe('login');
      router.redirect('register');

      setTimeout(() => {
        expect(document.body.textContent).toBe('register');

        router.redirect('notExistingPage');

        setTimeout(() => {
          expect(document.body.textContent).toBe('error');
          resolve();
        });
      });
    });
  });

  test('Should trigger metadata listener', function() {
    return new Promise((done) => {
      expect.assertions(4);

      const pathRouteMock = jest.fn();
      const metadataListenerMock = jest.fn();
      const config = new RouterConfigBuilder()
          .addRoute('path/:id', pathRouteMock)
          .addRoute('home', ()=>{})
          .addErrorRoute(()=>{})
          .addHomeRoutePath('home')
          .addMetadataChangeListener(metadataListenerMock)
          .build();

      const router = new Router(config);
      router.handleUrlPath();
      router.redirect('path/123');

      setTimeout(()=>{
        expect(metadataListenerMock).toHaveBeenCalledTimes(2);
        expect(metadataListenerMock).toHaveBeenCalledWith({
          id: '123',
        });
        expect(pathRouteMock).toHaveBeenCalledTimes(1);
        expect(pathRouteMock).toHaveBeenCalledWith({
          id: '123',
        });
        done();
      }, 200);
    });
  });
});
