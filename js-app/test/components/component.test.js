import {Component} from '../../src/components/component';

/**
 * Testing Component implementation.
 */
class TestComponent extends Component {
  executeSequence;

  /**
   * @inheritDoc
   */
  constructor(parent) {
    super(parent);
    this.executeSequence = ['constructor'];
    this.init();
  }

  /**
   * @inheritDoc
   */
  init() {
    this.executeSequence.push('init');
    super.init();
  }

  /**
   * @inheritDoc
   */
  render() {
    this.executeSequence.push('render');
    super.render();
  }

  /**
   * @inheritDoc
   */
  afterRender() {
    this.executeSequence.push('afterRender');
    super.afterRender();
  }

  /**
   * @inheritDoc
   */
  markup() {
    this.executeSequence;
    return '<slot><p>test</p></slot>';
  }
}

describe('Component', () => {
  beforeEach(()=>{
    document.body.innerHTML = '';
  });

  test(`Should return lifecycle sequence`, function() {
    expect.assertions(2);

    const testComponent = new TestComponent(document.body);

    expect(testComponent.executeSequence.join())
        .toBe(['constructor', 'init', 'render', 'afterRender'].join());

    testComponent.render();
    expect(testComponent.executeSequence.join())
        .toBe(['constructor', 'init', 'render', 'afterRender', 'render', 'afterRender'].join());
  });

  test(`Should insert markup in parent`, function() {
    expect.assertions(2);

    new TestComponent(document.body);

    expect(document.body.querySelectorAll('p').length).toBe(1);
    expect(document.body.querySelector('p').textContent).toBe('test');
  });
});
