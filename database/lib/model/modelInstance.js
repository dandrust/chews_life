function ModelInstance(model, attributes, metaData) {
  this.model = model;

  // metaData: persisted, changed, range
  this.metaData = metaData
  
  this.reload = function() {
    if (this.metaData.persisted) {
      this.setAttributesFromArray(this.metaData.range.getValues()[0]);
    }
    return this;
  }
  
  this.update = function(attributes) {
    this.setAttributesFromObject(attributes).save();
    return this;
  }
  
  this.destroy = function() {
    this.model.table.deleteRow(this.metaData.range.getRow());
    
    this.persisted = false;
    this.changed = true;
    return this;
  }
  
  this.save = function() {
    if (this.metaData.changed) {
      
      if (!this.beforeSave()) {
        return false;
      }
      
      if (this.metaData.persisted) {
        this.range.setValues([getAttributeArray()]);
        this.changed = false;
      } else {
        // Assign auto-increment id
        
        
        this.model.table.appendRow(this.getAttributeArray());
        
        rowReference = this.model.dataRange({force: true}).getLastRow();
        
        this.metaData.range = this.model.getRow(rowReference);
        
        this.persisted = true;
        this.changed = false;
      }
      
      this.afterSave();
      
    }
    return true
  }
  
  this.beforeSave = function () {
    this.model.beforeSave(this); 
  }
  
  this.afterSave = function() {
    this.model.afterSave(this); 
  }
  
  this.getAttributeArray = function() {
    return this.model.attributes.map(function(key) {
      return this[key];
    }, this)
  }
  
  this.setAttribute = function(key, value) {
    this[key] = value;
    return value;
  }
  
  this.setAttributes = function(attributes) {
    return this.setAttributesFromObject(attributes);
  }
  
  this.setAttributesFromObject = function (attributes) {
    Object.keys(attributes).forEach(function(key){
      if (this.model.hasAttribute(key)) {
        this.setAttribute(key, attributes[key]);
      }
    }, this)
    return attributes;
  }
  
  this.setAttributesFromArray = function(attributes) {
    this.model.attributes.forEach(function(key, index){
      this.setAttribute(key, attributes[index]);
    }, this)
    return attributes;
  }
  
  this.setAttributesFromObject(attributes);
}