function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Do it...', functionName: 'doIt'},
  ];
  spreadsheet.addMenu('Dev', menuItems);
}

var DB = SpreadsheetApp.getActiveSpreadsheet();

function ModelBase(name) {
  this.name = name;
  
  this.table = DB.getSheetByName(name);
    
  this.dataRange = this.table.getDataRange();

  this.initialize = function(attributes) {
    return new ModelInstance(this, attributes, {persisted: false, changed: true});
  };
  
  this.find = function(id) {
    range = this.getRow(this.getPrimaryKeys().indexOf(id))

    instance = new ModelInstance(this, {}, {persisted: true, changed: false, range: range });
    
    return instance.reload();
  };
  
  this.create = function(attributes) {
    return this.initialize(attributes).save 
  };

  this.getRow = function(index) {
    return this.table.getRange(this.dataRange.getRow() + index, 1, 1, this.dataRange.getWidth())
  }
    
  this.getPrimaryKeys = function() {
    
    data = this.table.getRange(this.dataRange.getRow(), this.primaryKey.index + 1, this.dataRange.getHeight() - 1, 1).getValues();
    
    return data.map(function(rowArray){
      return rowArray[0];
    })
  }
}

function Schema(schema) {
  this.schema = schema 
  this.primaryKey = {};
  Object.keys(schema).forEach(function(key, index){
    if (this.schema[key].hasOwnProperty('primaryKey')) {
      this.primaryKey.attribute = key;
      this.primaryKey.index = index;
    }
  }, this);
}

function Model(name, schema) {
  ModelBase.call(this, name);
  Schema.call(this, schema);
}

function ModelInstance(model, attributes, metaData) {
  this.model = model;

  Object.keys(this.model.schema).forEach(function(key){
    this.setAttribute(key, attributes[key]);
  }, this)

  this.metaData = metaData
  
  //{
  //  persisted: false,
  //  changed: true,
  //  range: undefined
  //}
  
  this.reload = function() {
    if (this.metaData.persisted) {

      data = this.metaData.range.getValues()[0];
      
      Object.keys(this.model.schema).forEach(function(key, index){
        this.setAttribute(key, data[index]);
      }, this) 
    }
    return this;
  }
  
  this.update = function(attributes) {
    Object.keys(attributes).forEach(function(key){
      if (this.model.schema.indexOf(key) > -1 ) {
        this.setAttribute(key, attributes[key]);
      }
    }, this)
  }
  
  this.destroy = function() {
    // Delete row
    
    this.persisted = false;
    this.changed = false;
  }
  
  this.setAttribute(key, value) = function() {
    this[key] = attribute;
  }
  
  this.save = function() {
    if (this.metaData.changed) {
      if (this.metaData.persisted) {
        // This is an existing record
        
        // You'll already have the range - just need to replace it
      } else {
        // Assign auto-increment id
        
        this.model.table.appendRow(this.getAttributeArray());
        
        this.persisted = true;
        this.changed = false;
      }
    }
    return true
  }
  
  this.getAttributeArray = function() {
    return Object.keys(this.model.schema).map(function(key){
      return this[key];
    },this)
  }
}

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

function go() {
  pt = ProductType.initialize({id: '2', displayName: 'whatever', makerRate: 5, subtype: false});
  pt.save();
}

function doIt() {
  pt = ProductType.find(2);
  showAlert(pt.displayName);
  
  var ui = SpreadsheetApp.getUi(); // Same variations.
  //ui.alert(pt.displayName);
}

function showAlert(string) {
  var ui = SpreadsheetApp.getUi()
  ui.alert(string);
}

function showAlertz() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Permission denied.');
  }
}



// Needs to be modified to only add id on change when a new row is added...
function autoIncrementId() {

  var AUTOINC_COLUMN = 0;
  var HEADER_ROW_COUNT = 1;
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var worksheet   = spreadsheet.getActiveSheet();
  var rows        = worksheet.getDataRange().getNumRows();
  var vals        = worksheet.getSheetValues(1, 1, rows+1, 2);
  
  for (var row = HEADER_ROW_COUNT; row < vals.length; row++) {
    try {
      var id = vals[row][AUTOINC_COLUMN];
      Logger.log(id);Logger.log((""+id).length ===0);
      if ((""+id).length === 0) {
        // Here the columns & rows are 1-indexed
        worksheet.getRange(row+1, AUTOINC_COLUMN+1).setValue(row);
      }
    } catch(ex) {
      // Keep calm and carry on
    }
  }
}

