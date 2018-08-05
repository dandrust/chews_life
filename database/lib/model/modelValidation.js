function ModelValidations() {
  this.validateUniqueness = function (instance, attribute) {
    return this.getValuesForAttribute(attribute).indexOf(instance[attribute]) === -1
  }
  this.validate = function (instance, callback, thisArg) {
    return callback.call(thisArg, instance);
  }
}