import {Component} from '../../src/components/component.js';

const {module, test} = QUnit;

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

module('Component', () => {
  test(`Lifecycle`, function(assert) {
    assert.expect(2);
    const fixture = document.getElementById('qunit-fixture');
    const testComponent = new TestComponent(fixture);

    assert.strictEqual(testComponent.executeSequence.join(),
        ['constructor', 'init', 'render', 'afterRender'].join(),
        'Should return executing sequence of component creating.');

    testComponent.render();
    assert.strictEqual(testComponent.executeSequence.join(),
        ['constructor', 'init', 'render', 'afterRender', 'render', 'afterRender'].join(),
        'Should return executing sequence of component creating.');
  });

  test(`Markup insertion`, function(assert) {
    assert.expect(3);
    const fixture = document.getElementById('qunit-fixture');

    assert.strictEqual(fixture.querySelectorAll('p').length,
        0,
        'Should return number of p-element before component creating.');

    new TestComponent(fixture);

    assert.strictEqual(fixture.querySelectorAll('p').length,
        1,
        'Should return number of p-element after component creating.');
    assert.strictEqual(fixture.querySelector('p').innerText,
        'test',
        'Should return innerText of p-element after component creating.');
  });
});
