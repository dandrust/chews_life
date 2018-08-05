function ModelSchema(schema) {
  this.schema = schema 
  
  this.setPrimaryKey = function () {
    this.primaryKey = {};
    
    this.attributes.forEach(function(key, index){
      if (this.schema[key].hasOwnProperty('primaryKey')) {
        this.primaryKey.attribute = key;
        this.primaryKey.index = index;
      }
    }, this);    
  }
  
  this.getPrimaryKeys = function() {
    return getValuesForAttribute(this.primaryKey.attribute)
  }
  
  this.attributes = function () {
    return Object.keys(this.schema);
  }
  
  this.hasAttribute = function (attribute) {
    return this.attributes.indexOf(attribute) > -1
  }
  
  this.setPrimaryKey();
}