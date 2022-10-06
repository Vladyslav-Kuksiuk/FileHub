const {module, test} = QUnit;

/**
 * Class to test form validation.
 */
export class FormValidationTester {
  /**
   * Returns form as HTML in string.
   *
   * @abstract
   * @returns {string}
   */
  getFormHTML() {
    throw new Error('Method of Abstract Class cannot be called');
  }

  /**
   * Inserts values in form inputs.
   *
   * @abstract
   * @param {HTMLFormElement} form
   * @param {[string]} values
   */
  fillInputs(form, values) {
    throw new Error('Method of Abstract Class cannot be called');
  }

  /**
   *  Adds validator to form.
   * @abstract
   * @param {HTMLFormElement} form
   */
  addValidator(form) {
    throw new Error('Method of Abstract Class cannot be called');
  }

  /**
   * Adds test on errors showing after validation.
   *
   * @param {string} moduleName
   * @param {[...string]}  parameters
   */
  addParametrizedErrorShowTest(moduleName, parameters) {
    module(moduleName, (hooks) => {
      const these = this;
      let form;

      hooks.beforeEach(() => {
        const fixture = document.getElementById('qunit-fixture');

        fixture.innerHTML = this.getFormHTML();
        form = fixture.firstElementChild;
        this.addValidator(form);
      });

      parameters
          .forEach((parameterSet) => {
            test(`Parameters: ${parameterSet}`, async function(assert) {
              const errorMessages = parameterSet[parameterSet.length - 1];
              const done = assert.async();
              assert.expect(errorMessages.length + 1);

              these.fillInputs(form, parameterSet);
              form.querySelector('button').click();

              setTimeout(() => {
                const errors = [...form.querySelectorAll('.help-block')];
                assert.strictEqual(errors.length, errorMessages.length, 'Should have same amount of errors');

                for (let i = 0; i < errorMessages.length; i++) {
                  assert.strictEqual(errors[i].innerText, errorMessages[i],
                      `Should show error '${errorMessages[i]}'`);
                }
                done();
              });
            });
          });
    });
  }

  /**
   * Adds test on errors clearing after validation.
   *
   * @param {string} moduleName
   * @param {[[...string],[...string]]} parameters
   */
  addClearErrorTest(moduleName, parameters) {
    module(moduleName, (hooks) => {
      const these = this;
      let form;

      hooks.beforeEach(() => {
        const fixture = document.getElementById('qunit-fixture');

        fixture.innerHTML = this.getFormHTML();
        form = fixture.firstElementChild;

        this.addValidator(form);
      });

      test('Clear errors', function(assert) {
        assert.expect(2);
        const done = assert.async();

        these.fillInputs(form, parameters[0]);
        form.querySelector('button').click();

        setTimeout(() => {
          const errors = [...form.querySelectorAll('input.input-error')];
          assert.strictEqual(errors.length, parameters[0].length, 'Should show 3 errors');

          these.fillInputs(form, parameters[1]);
          form.querySelector('button').click();

          setTimeout(() => {
            const errors = [...form.querySelectorAll('input.input-error')];
            assert.strictEqual(errors.length, 0, 'Should show 0 errors');

            done();
          });
        });
      });
    });
  }
}
