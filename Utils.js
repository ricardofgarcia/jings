/**
 * Returns the names of all sheets.
 * @param {boolean}  showOnlyVisible - If set to TRUE will only show visible sheets.
 * @param {string[]} sheetsToExclude - A list of sheets to exclude in the result.
 * @return The name of all sheets in the Google Sheets spreadsheet.
 * @customfunction
 */
function getAllSheetNames(showOnlyVisible=false,sheetsToExclude=null) {
  let ss = SpreadsheetApp.getActive();
  let sheets = ss.getSheets();
  let sheetNames = [];
  if(sheetsToExclude != null && sheetsToExclude.length .length != 0){sheetsToExclude = sheetsToExclude.flat();}
  sheets.forEach(function (sheet) {
    if (sheetsToExclude == null){
      if (showOnlyVisible){if(!sheet.isSheetHidden()){sheetNames.push(sheet.getName());}}
      else {sheetNames.push(sheet.getName());}
    }
    else{
      if (!sheetsToExclude.includes(sheet.getName())){
        if (showOnlyVisible){if(!sheet.isSheetHidden()){sheetNames.push(sheet.getName());}}
        else {sheetNames.push(sheet.getName());}
      }
    }
  });

  console.log(sheetsToExclude);

  return sheetNames;
}

function test_GetAllSheetNames(showOnlyVisible=false,sheetsToExclude=[]) {

  var retVal = getAllSheetNames(true,["Settings","Feed Refresh - Schedule"]);
  console.log(retVal);
}