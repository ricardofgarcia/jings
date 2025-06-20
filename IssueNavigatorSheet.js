//Globals
//-->
var gHeaderRowIndex        = 10;
var gHeaderColIndex        = 1;
//<--
function refreshJiraData(initialSheetName="") {
  //declare variables
  //-->
    var sheet;
    var jqlStmt;

    var startAt = 0;
    var totalIssuesToProcess  = 0;
    var totalIssuesProcessed  = 0;
    var lastDataRowWritten;
    var done = false;
    var processedJiraData = [];
  //<--

//try{

  console.log("refreshJiraData - refresh %s",initialSheetName);

  //get the sheet to refresh
  //-->
    if (!initialSheetName){initialSheetName = SpreadsheetApp.getActive().getSheetName();}
    sheet= SpreadsheetApp.getActive().getSheetByName(initialSheetName);
  //<--

  // get the JQL Stmt
  jqlStmt = getJqlStmt(sheet);

  //clear the old info
  //-->
    clearMessageBox(sheet);
    clearDataTable(sheet);
  //<--

  //refresh the sheet's header
  //-->
    //start with an array containing the headers for the fields to display
    processedJiraData.push(getJiraFieldsToFetch_DisplayName());

    //update header
    updateHeader(processedJiraData,sheet);

    //remove the header after writing it to the Google Sheet
    processedJiraData.splice(0,1); 

    lastDataRowWritten    = gHeaderRowIndex + 1; //(starting row with data)
  //<--

  do{
    var responseData = fetchJiraIssuesInfo(jqlStmt,startAt)

    //store total number of issues returned by the query
    totalIssuesToProcess = responseData["total"];

    //process response data
    processedJiraData = processJiraResponseData(responseData,processedJiraData);

    //if any results were returned
    if (totalIssuesToProcess > 0){
      //write data processed
      //-->
        writeJiraIssuesData(processedJiraData,lastDataRowWritten,sheet);
        lastDataRowWritten = lastDataRowWritten + processedJiraData.length;
      //<--
    }

    //update pagination data
    //-->
      //update the total number of issues processed
      totalIssuesProcessed    = totalIssuesProcessed + processedJiraData.length;

      //set the next starting record
      startAt = totalIssuesProcessed;
    //<--

    //clear the results array
    processedJiraData = [];

    //TODO: Remove after I am able to properly check if all issues have been processed
    if (totalIssuesProcessed == totalIssuesToProcess){
      done = true;
    }
  } while(!done);

  logLastDataRefresh(initialSheetName);

  //return processedJiraData;
//}
/* catch (err){
  console.log(err);
  throw(err.message,sheet);
}*/
}

function logLastDataRefresh(refreshedSheetName)
{
  //log last refresh
  const lastRefreshedRow = 1;
  const lastRefreshedCol = 5;
  const dLastRefreshedDate= new Date();
  sLastRefreshedDate = dLastRefreshedDate.toLocaleString() + " (GMT - " + dLastRefreshedDate.getTimezoneOffset()/60 + ")";
  //const lastRefreshedDate = new Date().toUTCString();

  var sheet= SpreadsheetApp.getActive().getSheetByName(refreshedSheetName);
  sheet.getRange(lastRefreshedRow,lastRefreshedCol-1,1,1).setValue("Last Updated: ");
  sheet.getRange(lastRefreshedRow,lastRefreshedCol,1,1).setValue(sLastRefreshedDate);
}

/**
* writes the issues data into the sheet
*/
function writeJiraIssuesData(processedJiraData,lastDataRowWritten,sheet){
var numRows = processedJiraData.length;
var numCols = processedJiraData[0].length;
sheet.getRange(lastDataRowWritten,1,numRows,numCols).setValues(processedJiraData);
}

function updateHeader(header,sheet){
var numRows = header.length;
var numCols = header[0].length;
sheet.getRange(gHeaderRowIndex,gHeaderColIndex,numRows,numCols).setValues(header);

}

const gJqlStmtRow = 2;
const gJqlStmtCol = 2;
function getJqlStmt(sheet){
var jqlStmt = sheet.getRange(gJqlStmtRow,gJqlStmtCol).getValue();

if (jqlStmt == ""){
  throw(new Error("Please provide a JQL statement"));
}

return jqlStmt;
}

const gMessageRow = 6;
const gMessageCol = 2;
function logMessage(message,sheet){
sheet.getRange(gMessageRow,gMessageCol).setValue(message);
}

function clearMessageBox(sheet){
logMessage("",sheet);
}

const gDataTableRow = 11;
const gDataTableCol = 1;
function clearDataTable(sheet){
  //clear the previous data
  //-->
    //clear the previous data
    var maxRows = sheet.getMaxRows();
    var maxCols = sheet.getMaxColumns();
    var range = sheet.getRange(gDataTableRow,gDataTableCol,maxRows-gDataTableRow+1,maxCols);
    range.clearContent();
  //<--

}