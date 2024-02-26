var gFeedRefreshSheet_Name = "Feed Refresh - Schedule";
var gFeedRefreshSheet_Row = 2;
var gFeedRefreshSheet_Name_Col = 1;

function consolidateData() {
  var teamName;
  var dataRange = "$A$11:$AB";
  var teamDataRange;
  //var queryString = "\"SELECT D,C,F,M,N WHERE D <> ''\"";
  //var queryString = "\"SELECT Col5,Col4,Col14,Col1,Col13,Col17,Col24,Col25,Col26,Col27,Col28 WHERE Col4 <> '' LABEL Col5 'Description', Col4 'Jira Key', Col14 'Priority', Col1 'Parent'\"";
  var queryString = "\"SELECT E,D,N,A,M,Q,X,Y,Z,AA,AB WHERE D <> ''\"";
  //console.log("queryString: " + queryString);

  var onErrorValue = "{\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"}";
  //console.log("onErrorValue: " + onErrorValue);

  var formulaTemplate = "IFERROR(QUERY(TEAM_DATA_RANGE,QUERY_STRING,1),ON_ERROR_VALUE)";
  console.log("formulaTemplate: " + formulaTemplate);

  formulaTemplate = formulaTemplate.replace("QUERY_STRING",queryString);
  console.log("formulaTemplate: " + formulaTemplate);

  formulaTemplate = formulaTemplate.replace("ON_ERROR_VALUE",onErrorValue);
  console.log("formulaTemplate: " + formulaTemplate);

  var formula = formulaTemplate;
  formula = formula.replace("TEAM_DATA_RANGE",teamDataRange);
  console.log("formula: " + formula);

  //set formula
  var inputSheet= SpreadsheetApp.getActive().getSheetByName(gFeedRefreshSheet_Name);
  var outputSheet= SpreadsheetApp.getActive().getSheetByName("data (consolidated)");

  //=IFERROR(QUERY('SREP: ARO'!$C$4:$N,"SELECT D,C,F,M,N WHERE D <> ''",1),{"","","","",""})

  //loop through the list of items to check
  var inputRange = inputSheet.getRange(gFeedRefreshSheet_Row,gFeedRefreshSheet_Name_Col,inputSheet.getMaxRows(),gFeedRefreshSheet_Name_Col);
  var numRows = inputRange.getNumRows();

  var queries = [];
  var queryFormula;

  for (var y = 1; y <= numRows; y++) {

    teamName = inputRange.getCell(y,gFeedRefreshSheet_Name_Col).getValue();

    if (!teamName){
      y = numRows+1; //exit loop
    }
    else{
      teamDataRange = "'" + teamName + "'" + "!" + dataRange;
      console.log("teamDataRange: " + teamDataRange);

      formula = formulaTemplate.replace("TEAM_DATA_RANGE",teamDataRange);
      console.log("formula: " + formula);
      queries.push(formula);
    }

  }
    //update the formula containing the number of issues for the team
    queryFormula = "{" + String.fromCharCode(10) + queries.join(";" + String.fromCharCode(10)) + String.fromCharCode(10) + "}";
    outputSheet.getRange(3,2,1,1).getCell(1,1).setFormula(queryFormula);

}
