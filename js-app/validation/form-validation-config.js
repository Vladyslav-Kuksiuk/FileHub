export class FormValidationConfig {
  fieldValidators = [];

  constructor(fieldValidators) {
    this.fieldValidators = fieldValidators;
  }

  forEachField(func) {
    this.fieldValidators.forEach((fieldValidators) => {
      func(fieldValidators.fieldName, fieldValidators.validators);
    });
  }
}

export class FormValidationConfigBuilder {
  fieldValidators = [];

  addField(fieldName, ...validators) {
    this.fieldValidators.push({
      fieldName: fieldName,
      validators: validators,
    });
    return this;
  }

  build() {
    return new FormValidationConfig(this.fieldValidators);
  }
}
