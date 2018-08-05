function ModelCallback(thisArg) {
  this.context = thisArg
  this.chain = []
  this.push = function (fn, argumentArray, thisArg) {
    this.chain.push({fn: fn, arguments: argumentArray, context: thisArg});
  }
  this.unshift = function (fn, argumentArray, thisArg) {
    this.chain.unshift({fn: fn, arguments: argumentArray, context: thisArg});
  }
  this.run = function (instance) {
    if (this.chain.length === 0) {
      return true;
    }
    return this.recursiveRunner(this.chain, 0, instance);
  }
  this.recursiveRunner = function (fnArray, index, instance) {
    if (index === this.chain.length) {
      return true;
    }
    
    fn = fnArray[index].fn;
    context = fnArray[index].context || this.context
    arguments = fnArray[index].arguments
    if (fn.apply(context, arguments.unshift(instance))) {
      return this.recursiveRunner(fnArray, ++index, instance);
    } 
    
    return false;
  }
}