/**
 * Utilities for building queries using "display field names" instead of column letters
 * 
 */

//get fields map
const gFieldsMapSheet_Name = "FieldMap-JINGS";
const gFieldsMapSheet_StartRow = 3;
const gFieldsMapSheet_StartCol = 1;
//var gFieldsMap = new Map();

function getFieldsMap(sheetName=gFieldsMapSheet_Name) {
  if (sheetName == "") { sheetName=gFieldsMapSheet_Name; }

  var sheet= SpreadsheetApp.getActive().getSheetByName(sheetName);
  var fieldMapTable = sheet.getRange(gFieldsMapSheet_StartRow,gFieldsMapSheet_StartCol,sheet.getMaxRows()-gFieldsMapSheet_StartRow+1,2);
  var numRows = fieldMapTable.getNumRows();
  var fieldsMap = new Map();

  var fieldName;
  var fieldColumn;
  for (var y = 1; y <= numRows; y++) {
    fieldName = fieldMapTable.getCell(y,1).getValue();
    fieldColumn = fieldMapTable.getCell(y,2).getValue();

    if (!fieldName){
      y = numRows+1; //exit loop
    }
    else{
      fieldsMap.set(fieldName,fieldColumn);
    }
  }

  console.log(fieldsMap);
  return fieldsMap;
}

//replace field names with table columns

function test_getFieldsMap(){

  var fieldsMap = getFieldsMap();
  printMap(fieldsMap);

}

function printMap(map){

  for (let [key, value] of map) {
    console.log(key + " = " + value);
  }

}

function test_transformQuery(){
  //var originalQuery = "SELECT [Parent Link],MAX([Due Date]) WHERE NOT [Due Date] IS NULL AND NOT [Key] IS NULL AND [Type] <> 'Feature' GROUP BY [Parent Link] ORDER BY [Parent Link] LABEL MAX([Due Date]) 'MAX(Epic.DueDate)'";
  var originalQuery = "SELECT [Key],[Type],[Summary],[Status],[Color Status],[Hierarchy Progress],[Due Date],[Target End Date],[Fix Version(s)],[impacts account] WHERE [impacts account]='XXX' AND [Type]='Feature'";

  var transformedQuery = transformQuery(originalQuery.split("WHERE")[0]) + " WHERE " + transformQuery(originalQuery.split("WHERE")[1]);

  console.log("Original query: '%s'", originalQuery);
  console.log("Transformed query: '%s'",transformedQuery);
}

function printSheetInput(sheetInput){
  console.log(sheetInput);
  Logger.log(sheetInput);
  return "hello world";
}

//this function takes the field names and converts them into their respective columns
function transformQuery(queryString,fieldsMapSheet = ""){
  var map = getFieldsMap(fieldsMapSheet);

  var outputQuery = queryString;

  for (let [key, value] of map) {
    var fieldName = "[" + key + "]";
    var fieldColumn = value;

    //console.log("Before: " + outputQuery);
    outputQuery = outputQuery.replaceAll(fieldName,fieldColumn);
    //console.log("After: " + outputQuery);

    //outputQuery = outputQuery.replaceAll(fieldName,fieldColumn);
    //var pattern = new RegExp("\['" + key + "'\]","g");
    //var replacement = value
    //outputQuery = outputQuery.replaceAll(pattern,replacement);
  }

  return outputQuery;
}