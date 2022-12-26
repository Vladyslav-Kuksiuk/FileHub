/**
 * Class to configure form inputs validation.
 */
export class FormValidationConfig {

  fieldValidators;
  /**
   * @typedef FieldValidator
   * @property {string} fieldName
   * @property {[function(*): Promise<ValidationError>]} validators
   */

  /**
   * @param {FieldValidator[]} fieldValidators
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
   * @param {[function(*): Promise<ValidationError>]} validators
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
