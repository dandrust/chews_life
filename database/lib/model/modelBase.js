function ModelBase(name) {
  this.tableName = name;
  
  // 1-based + header
  this.rowOffset = 2
  
  // 1-based
  this.columnOffset = 1
  
  this.table = DB.getSheetByName(name);
    
  this.dataRange = function(options) {
    options = options || {};
    
    if (!this.cache.dataRange || options.force) {
      this.cache.dataRange = this.table.getDataRange();      
    } 
    
    return this.cache.dataRange
  }
  
  this.cache = {}

  this.initialize = function(attributes) {
    return new ModelInstance(this, attributes, {persisted: false, changed: true});
  };
  
  this.find = function(id) {
    range = this.getRow(this.dataRange().getRow() + this.getPrimaryKeys().indexOf(id))

    instance = new ModelInstance(this, {}, {persisted: true, changed: false, range: range });
    
    return instance.reload();
  };
  
  this.create = function(attributes) {
    instance = this.initialize(attributes);
    instance.save();
    return instance;
  };

  this.getRow = function(index) {
    return this.table.getRange(index, 1, 1, this.dataRange().getWidth());
  }
  
  this.getRowValues = function (index) {
    return this.getRow.getValues()[0];
  }
  
  this.getColumn = function (index) {
    return this.table.getRange(rowOffset, index, this.dataRange().getHeight() - this.colOffset, 1);
  }
  
  this.getColumnValues = function (index) {
    data = this.getColumn.getValues();
    
    return data.map(function(rowArray){
      return rowArray[0];
    })
  }
  
  this.getValuesForAttribute = function (attribute) {
    if (this.hasAttribute(attribute)) {
      this.getColumnValues(index);
    }
    
    return undefined;
  }
  
  this.beforeSave = new ModelCallback(this);
  
  this.beforeSave.push(this.validateUniqueness, this.primaryKey.attribute);
  
  this.afterSave = new ModelCallback(this);   
}