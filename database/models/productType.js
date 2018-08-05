var ProductType = new Model('productTypes', {
  id: {
    dataType: 'number',
    primaryKey: true
  },
  displayName: {
    dataType: 'string',
  },
  makerRate: {
    dataType:'number',
  },
  subtype: {
    dataType: 'boolean',
  }
});

// This is an example
ProductType.defineMethod('multipleMakerRate', function (factor) {
  return this.makerRate * factor;
})