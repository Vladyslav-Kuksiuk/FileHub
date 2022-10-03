/**
 * Class to configure form inputs validation.
 */
export class FormValidationConfig {
  fieldValidators;

  /**
   * @param {*[]}fieldValidators
   */
  constructor(fieldValidators) {
    this.fieldValidators = fieldValidators;
  }

  /**
   * Apply function to all fields.
   *
   * @param {function} applyingFunction
   */
  forEachField(applyingFunction) {
    this.fieldValidators.forEach((fieldValidators) => {
      applyingFunction(fieldValidators.fieldName, fieldValidators.validators);
    });
  }
}

/**
 * Builder for {@link FormValidationConfig}.
 */
export class FormValidationConfigBuilder {
  #fieldValidators = [];

  /**
   * Add validators to field.
   *
   * @param {string} fieldName
   * @param {...function} validators
   * @returns {FormValidationConfigBuilder}
   */
  addField(fieldName, ...validators) {
    this.#fieldValidators.push({
      fieldName: fieldName,
      validators: validators,
    });
    return this;
  }

  /**
   * Build FormValidationConfig.
   *
   * @returns {FormValidationConfig}
   */
  build() {
    return new FormValidationConfig(this.#fieldValidators);
  }
}
