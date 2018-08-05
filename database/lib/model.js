function Model(name, schema) {
  ModelBase.call(this, name);
  ModelSchema.call(this, schema);
  
  this.defineMethod = function (methodName, f) {
    this[methodName] = f;
  }
}