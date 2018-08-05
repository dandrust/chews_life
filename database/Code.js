function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Do it...', functionName: 'doIt'},
  ];
  spreadsheet.addMenu('Dev', menuItems);
}

function go() {
  pt = ProductType.initialize({id: '2', displayName: 'whatever', makerRate: 5, subtype: false});
  pt.save();
}

function doIt() {
  //pt = ProductType.find(2);
    pt = ProductType.create({id:20,displayName:'whateverz',	makerRate:15,subtype:true});
    //showAlert('is it there?');
    pt.destroy();
    
//  showAlert(pt.id);
  
  var ui = SpreadsheetApp.getUi(); // Same variations.
  //ui.alert(pt.displayName);
}

function showAlert(string) {
  var ui = SpreadsheetApp.getUi()
  ui.alert(string);
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

