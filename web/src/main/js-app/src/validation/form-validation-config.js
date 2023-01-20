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
   * @param {...Function} validators
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
