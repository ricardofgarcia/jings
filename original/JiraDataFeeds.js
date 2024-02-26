/**
 * This function refreshes the data feeds identified in the tab 'Feed Refresh - Schedule'
 */
function refreshDataFeeds(frequency="Hourly"){

  var refreshScheduleSheetName = "Feed Refresh - Schedule";
  var refreshLogSheetName = "Feed Refresh - Log";
  var sheetToRefreshName = "";
  var sheetToRefreshFrequency = "";
  var sheet= SpreadsheetApp.getActive().getSheetByName(refreshScheduleSheetName);

  //read list of sheets to refresh
  //-->
    var feedIndex	= 1, frequencyIndex=2,	lastRefreshedIndex=3;
    var numCols = 3; //number of columns with value
    var myRange = sheet.getRange(2,1,sheet.getMaxRows(),numCols);
    var numRows = myRange.getNumRows();

    for (var y = 1; y <= numRows; y++) {
      sheetToRefreshName = myRange.getCell(y,feedIndex).getValue();
      if (!sheetToRefreshName){
        y = numRows+1; //exit loop
      }
      else{
        sheetToRefreshFrequency = myRange.getCell(y,frequencyIndex).getValue();
        Logger.log("row: " + y + " - sheetToRefreshName: " + sheetToRefreshName + " - sheetToRefreshFrequency: " + sheetToRefreshFrequency);

        //refresh data in sheet
        if (sheetToRefreshFrequency === frequency){
          refreshJiraData(sheetToRefreshName);
        }

        //log result
        var lastRefreshedDate = new Date().toUTCString();
        myRange.getCell(y,lastRefreshedIndex).setValue(lastRefreshedDate);
      }
    }

  //<--

}

function refreshJiraData(initialSheetName="") {
  
  var sheet;

  var accessToken;
  var jql;
  var jiraData;
  //var initialSheetName;
  
  //read inputs
  if (!initialSheetName){initialSheetName = SpreadsheetApp.getActive().getSheetName();}
  sheet= SpreadsheetApp.getActive().getSheetByName('Security');
  accessToken = sheet.getRange(2,2).getValue();
  
  //  - JQL (Active Sheet $B$2)
  sheet= SpreadsheetApp.getActive().getSheetByName(initialSheetName);
  jql = sheet.getRange(2,2).getValue();

  //clear the previous data
  //-->
    sheet= SpreadsheetApp.getActive().getSheetByName(initialSheetName);
    //clear the previous data
    var maxRows = sheet.getMaxRows();
    var maxCols = sheet.getMaxColumns();
    var range = sheet.getRange(11,1,maxRows,maxCols);
    range.clearContent();
  //<--

  //get data
  //-->>
  //  - Cell where to place the data (need to clear contents beyond)
  //Set at B11
  //--> CONTINUE HERE
    //passing sheet parameter so that the data can be written to the spreadhsheet as processed.
    jiraData = getDataUsingJiraApi(accessToken,jql,sheet);
    //var headers = jiraData.pop();
    //jiraData.slice(1)
    //Logger.log(headers);
  //<--

  //write data
  //-->
/*
    sheet= SpreadsheetApp.getActive().getSheetByName(initialSheetName);
    //remove the header
    //jiraData.splice(0,1);
    // calculate the number of rows and columns needed
    var numRows = jiraData.length;
    var numCols = jiraData[0].length;
    sheet.getRange(10,1,numRows,numCols).setValues(jiraData);
    //sheet.getRange(11,1,numRows,numCols).setValues(jiraData);
*/
  //<--
  //console.log('accessToken: ' + accessToken);

}

//loops through the values of a Jira Array Field and returns them in a CSV string
function getFieldArrayValuesAsCsv(jiraArrayField,key="value"){
  Logger.log(jiraArrayField);
  var arrayFieldElement;
  var arrayFieldElementDict;

  var value;
  var valuesCsv = "";

  for (arrayFieldElement in jiraArrayField){
    arrayFieldElementDict = jiraArrayField[arrayFieldElement];
//    Logger.log(arrayFieldElement);
//    Logger.log(arrayFieldElementDict);
//    Logger.log(arrayFieldElementDict[key]);

    value = arrayFieldElementDict[key];
    Logger.log("value: " + value);

    if (valuesCsv == ""){valuesCsv=value;}else{valuesCsv=valuesCsv + "," + value}
  }
  Logger.log("valuesCsv: '" + valuesCsv + "'");
  return valuesCsv;
}

/**
    This function uses paging results to get all the issues returned by a searh
*/
  /** 
   * startAt = 0
   * maxResults = 500
   * totalNumberOfRecords = 0
   * totalIssuesProcessed = 0
   * lastRowWritten = 10 (start of data in the table)
   * done = false
   * 
   * //do while not done
   *  //fetch data from jira using startAt as a parameter
   * 
   *  //store total number of issues returned by the query
   *    totalNumberOfRecords = data["total"];
   *  
   *  //process the issues returned
   * 
   *  //update the total number of issues processed
   *  totalIssuesProcessed = totalIssuesProcessed + data.issues.length 
   *  
   *  //save data from the issues processed in google sheet
   * 
   *  //store index of the last row written in the google sheet
   *    lastRowWritten = lastRowWritten + data.issues.length
   *  //update starting point to get the next set of data
   *    startAt = startAt + data["issues"].length
   *
   *  //check if all the issues have been processed
   *  if (totalIssuesProcessed = totalNumberOfRecords)
   *    done = true
   *
   * //end do
   * 
  */
function getDataUsingJiraApi( accessToken,
                              jql,
                              sheet
                            )
{
  var startAt = 0;
  //var maxResults = 500;
  var totalIssuesToProcess  = 0;
  var totalIssuesProcessed  = 0;
  var headerRowIndex = 10;
  var lastDataRowWritten    = headerRowIndex + 1; //(starting row with data)
  var done = false;
  var processedJiraData = createJiraDataArray();

  //clear the previous data
  //-->
    var maxRows = sheet.getMaxRows();
    var maxCols = sheet.getMaxColumns();
    var range = sheet.getRange(11,1,maxRows,maxCols);
    range.clearContent();
  //<--

  //Update the header
  //-->
    // calculate the number of rows and columns needed
    var numRows = processedJiraData.length;
    var numCols = processedJiraData[0].length;
    sheet.getRange(headerRowIndex,1,numRows,numCols).setValues(processedJiraData);
    processedJiraData.splice(0,1); //remove the header after writing it to the Google Sheet
  //<--

  do{
    // fetch data
    var response = fetchDataFromJira(accessToken,jql,startAt);
    // check result
    if (response.getResponseCode() >= 400) {
      console.log("Connection error " + response.getResponseCode());
    }else{
      console.log("SUCCESS! " + response.getResponseCode());
      var responseData = JSON.parse(response.getContentText());

      //store total number of issues returned by the query
      totalIssuesToProcess = responseData["total"];

      //process response data
      processedJiraData = processJiraResponseData(responseData,processedJiraData);

      //write data processed
      //-->
        var numRows = processedJiraData.length;
        //var numCols = processedJiraData[1].length;
        var numCols = processedJiraData[0].length;
        sheet.getRange(lastDataRowWritten,1,numRows,numCols).setValues(processedJiraData);
        lastDataRowWritten = lastDataRowWritten + processedJiraData.length;
      //<--

      //update the total number of issues processed
      totalIssuesProcessed    = totalIssuesProcessed + processedJiraData.length;
      //totalIssuesProcessed  = totalIssuesProcessed + responseData["issues"].length;

      //set the next starting record
      startAt = totalIssuesProcessed;

      //clear the results array
      processedJiraData = [];

      //TODO: Remove after I am able to properly check if all issues have been processed
      if (totalIssuesProcessed == totalIssuesToProcess){
        done = true;
      }
    }
  } while(!done);

  return processedJiraData;
}

/**
 * This function returns the data processed from the response
 */
function processJiraResponseData(responseData,processedJiraData){
  var data = responseData;
  var jiraData = processedJiraData;

  //values to fetch
    var issueType = '';
    var key = '';
    var summary = '';
    var status = '';
    var parentLink = '';
    var epicLink = '';
    var assignee = '';
    var issueLinks;
    var issueLinksCsv;
    var issueLinkIndex;
    var issueLink;
    var description;
    var sprint;
    var storyPoints;
    var resolution;
    var labels;
    var priority;
    var originalStoryPoints;
    var poolTeam;
    var components;
    var updated;
    var reporter;
    var fixVersions;
    var targetStartDate;
    var targetEndDate;
    var blocked;
    var tShirtSize;

  //iterate over each jira issue and get the data of interest
  for (var issueskey in data["issues"]){
    issue = data["issues"][issueskey];

    issueType = issue.fields.issuetype.name;
    key = issue.key;
    summary = issue.fields.summary;
    status = issue.fields.status.name;
    issueLinksCsv = "none";

    if (issue.fields["customfield_12313941"] == null) {targetStartDate = ''} else{ targetStartDate = issue.fields.customfield_12313941;}

    if (issue.fields["customfield_12313942"] == null) {targetEndDate = ''} else{ targetEndDate = issue.fields.customfield_12313942;}
    if (issue.fields["customfield_12316543"] == null) {blocked = ''} else{ blocked = issue.fields["customfield_12316543"]["value"];}

    if (issue.fields["customfield_12313140"] == null) {parentLink = ''} else{ parentLink = issue.fields.customfield_12313140;}
    if (issue.fields["customfield_12311140"] == null) {epicLink = ''} else{ epicLink = issue.fields.customfield_12311140;}
    if (issue.fields["assignee"] == null) {assignee = ''} else{ assignee = issue.fields.assignee.emailAddress;}
    if (issue.fields["description"] == null) {description = ''} else{ description = issue.fields["description"].substring(256);}
    //leaving the description out for now...
    description = "";
    if (issue.fields["customfield_12310243"] == null) {storyPoints = ''} else{ storyPoints = issue.fields["customfield_12310243"]}
    if (issue.fields["resolution"] == null) {resolution = ''} else{ resolution = issue.fields["resolution"]["name"];}
    if (issue.fields["labels"] == null) {labels = ''} else{ labels = issue.fields["labels"].join("|");}
    //Capture priority
    if (issue.fields["priority"] == null) {priority = ''} else{ priority = issue.fields["priority"]["name"];}
    if (issue.fields["customfield_12314040"] == null) {originalStoryPoints = ''} else{ originalStoryPoints = issue.fields["customfield_12314040"]}
    if (issue.fields["customfield_12317259"] == null) {poolTeam = ''}
    else{
      poolTeam = getFieldArrayValuesAsCsv(issue.fields["customfield_12317259"],"value");
      Logger.log("poolTeam: '" + poolTeam +"'");
    }
    if (issue.fields["components"] == null || issue.fields["components"].length == 0) {components = ''}
    else{
      components = getFieldArrayValuesAsCsv(issue.fields["components"],"name");
      Logger.log("components: '" + components +"'");
    }
    if (issue.fields["updated"] == null) {updated = ''} else{ updated = issue.fields["updated"].split("T")[0];}
    if (issue.fields["reporter"] == null) {reporter = ''} else{ reporter = issue.fields.reporter.emailAddress;}
    if (issue.fields["fixVersions"] == null || issue.fields["fixVersions"].length == 0) {fixVersions = ''}
    else{
      fixVersions = getFieldArrayValuesAsCsv(issue.fields["fixVersions"],"name");
      Logger.log("fixVersions: '" + components +"'");
    }
    //customfield_12316541
    if (issue.fields["customfield_12316541"] == null) {
      tShirtSize = '';
    }
    else{
      tShirtSize = issue.fields["customfield_12316541"].value;
    }


    //Logger.log("labels: " + labels);
    
    //process sprint(s)
    sprint = "";
    if (issue.fields["customfield_12310940"] == null) {sprint = ''}
    else{
        var sFieldValue;
        var aFieldValues = [{}];
        var sprints = issue.fields["customfield_12310940"];
        sFieldValues   = issue.fields["customfield_12310940"][sprints.length -1]; //picking the last sprint
        //sFieldValues   = issue.fields["customfield_12310940"][0]; //picking the first sprint
        aFieldValues  = sFieldValues.split(",");
        var sKeyValue,sKey,sValue;
        var aKeyValues = [{}];

        var i, len = aFieldValues.length;
        var done = false;
        for (i=0; i<len && !done; ++i) {
          sKeyValue = aFieldValues[i];
          aKeyValues = sKeyValue.split("=");
          sKey = aKeyValues[0];
          sValue = aKeyValues[1];
          if (sKey == "name") {
            sprint = sValue
            done = true;
          }
        }

    }

    Logger.log("Processing " + key + ":" + summary);

    var jiraDataRecord = [parentLink,epicLink,issueType,key,summary,status,assignee,issueLinksCsv,description,sprint,storyPoints,resolution,labels,priority,originalStoryPoints,poolTeam,components,updated,reporter,fixVersions,targetStartDate,targetEndDate,blocked,tShirtSize];

    //process the issue links
    issueLinks = issue.fields.issuelinks;
    var issueLinksMap = null;
    var linkedIssuesCsv = null;
    if (issueLinks != null){

      issueLinksMap = getIssueLinks(issueLinks);

        for (const issueLinkType of issueLinksMap.keys()){
          linkedIssuesCsv = issueLinksMap.get(issueLinkType);
          jiraDataRecord.push(linkedIssuesCsv);
          //console.log("testGetIssueLinks: " + issueLinkType);
          //console.log("testGetIssueLinks: " + linkedIssuesCsv);
        }

      /*
      for (issueLinkIndex in issueLinks){
        issueLink = issueLinks[issueLinkIndex];
        if (issueLink != null){
          if (issueLink.type.name == "Related"){
            if (issueLinksCsv == "none"){
              if (issueLink.inwardIssue != null){
                issueLinksCsv = issueLink.inwardIssue.key;
              }
              else if (issueLink.outwardIssue != null){
                issueLinksCsv = issueLink.outwardIssue.key;
              }                    
            }
            else{
              if (issueLink.inwardIssue != null){
                issueLinksCsv = issueLinksCsv + "," + issueLink.inwardIssue.key;
              }
              else if (issueLink.outwardIssue != null){
                issueLinksCsv = issueLinksCsv + "," + issueLink.outwardIssue.key;
              }                    
            }
          }
        }
      }
      */
    }
    jiraData.push(jiraDataRecord);
    //Logger.log("issueLinksCsv: " + issueLinksCsv);
  }
  return jiraData;
}

/**
 * returns Jira fields to fetch
 //TODO: Make fields configurable - read from somewhere in the Google Sheet
*/
function getJiraFieldsToFetch(){
  var fields      = '&fields=customfield_12313140,issuetype,key,id,customfield_12311141,summary,status,customfield_12317259,priority,components,customfield_12313941,customfield_12313942,customfield_12311140,assignee,reporter,issuelinks,description,customfield_12310940,customfield_12310243,resolution,labels,customfield_12314040,customfield_12317259,components,updated,reporter,fixVersions,customfield_12313941,customfield_12313942,customfield_12316543,customfield_12316541';

  return fields;
}

/**
 * Returns an array with only one header row
 //TODO: Make fields configurable - read from somewhere in the Google Sheet
*/
function createJiraDataArray(){
  var jiraData = [];
  var headers = ["Parent Link","Epic Link","Issue Type","Key","Summary","Status","Assignee","IssueLinks","Description","Sprint","Story Points","Resolution","Labels","Priority","Original story points","Pool Team", "Components","Updated","Reporter","Fix Versions","Target Start","Target End","Blocked","T-Shirt Size"];

  //add the links to the headers
  for (const issueLinkType of gIssueLinkTypesMap.keys()){
    headers.push(issueLinkType);
  }

  jiraData.push(headers);
  return jiraData;
}

/**
 * This function fetches the data returned by the given jql statement
 */
function fetchDataFromJira(accessToken,jql,startAt=0,maxResults=1000){
    var headers = { 'Authorization' : 'Bearer ' + accessToken};
    var options = {
      "async": true,
      'method' : 'GET',
      'contentType': 'application/json',
      'headers' : headers,
      'muteHttpExceptions' : false
    };

    var api_url     = 'https://issues.redhat.com/rest/api/2/search?';
    var api_params  = 'jql='+jql;
    //var api_params  = 'jql='+encodeURI(jql);
    //var api_params  = 'jql='+encodeURIComponent(jql);
    var fields      = getJiraFieldsToFetch();
    var request_url = api_url + api_params + fields + '&maxResults=' + maxResults + '&startAt=' + startAt;

    var response = UrlFetchApp.fetch(encodeURI(request_url), options);

    return response;
}

//
//
/** Functions supporting Jira Project Releases - Fix Version/s: **/
//
//

/**
 * This function fetches the Jira Project Releases
 */
function getProjectReleases(initialSheetName = null) {
  
  var sheet;

  var accessToken;
  var releaseData;
  var fixVersionData = createReleaseDataArray();
  
  // Get Jira accessToken
  sheet= SpreadsheetApp.getActive().getSheetByName('Security');
  accessToken = sheet.getRange(2,2).getValue();

// Activate after adding the image button on 'Fix Version/s: (Release)' sheet
//  if (!initialSheetName){
//    initialSheetName = SpreadsheetApp.getActive().getSheetName();
//  } 
  
  //clear the previous data
  sheet= SpreadsheetApp.getActive().getSheetByName('Fix Version/s: (Release)');
  var maxRows = sheet.getMaxRows();
  var maxCols = sheet.getMaxColumns();
  var range = sheet.getRange(6,1,maxRows,maxCols);
  range.clearContent();

  // Fetch the Project Level Releases from Jira
  releaseData = fetchProjectReleases(accessToken);
  // Parse and filter out Released and Archived Releases
  processReleaseData(releaseData, fixVersionData);

  //Write the Jira Project Releases data to the sheet
  var numRows = fixVersionData.length;
  var numCols = fixVersionData[0].length;
  sheet.getRange(6,1,numRows,numCols).setValues(fixVersionData);

  console.log("SUCCESS! Wrote out " + numRows + " Jira Project Releases (rows) to the sheet.");

}

/**
 * Returns an array with only one header row
 //TODO: Make fields configurable - read from somewhere in the Google Sheet
*/
function createReleaseDataArray(){
  var releaseData = [];
  releaseData.push(["Version Name", "Status","Start date","End date"]);
  return releaseData;
}

/**
 * This function fetches the Jira Project Releases
 */
function fetchProjectReleases(accessToken){
    var headers = { 'Authorization' : 'Bearer ' + accessToken};
    var options = {
      "async": true,
      'method' : 'GET',
      'contentType': 'application/json',
      'headers' : headers,
      'muteHttpExceptions' : false
    };

    var api_url     = 'https://issues.redhat.com/rest/api/2/project/AUTOBU/versions';
    var response = UrlFetchApp.fetch(encodeURI(api_url), options);
    console.log("Releases (Fix Version/s:) Data " + response);

    if (response.getResponseCode() >= 400) {
      console.log("Connection error " + response.getResponseCode());
    }else{
      console.log("SUCCESS! " + response.getResponseCode());
      var responseData = JSON.parse(response.getContentText());
      // console.log("Parced responseData: " + responseData);
    }
    return responseData;
}

/**
 * This function returns the parsed & processed release data from the Jira API response
 */
function processReleaseData(responseData,processedJiraData){
  var data = responseData;
  var jiraData = processedJiraData;

  console.log("responseData " + responseData);
  console.log("jiraData " + jiraData);

  //values to process
    var releaseName;
    var releaseStatus;
    var startDate;
    var releaseDate;

  //iterate over each Jira Project Release and get the data of interest
  for (var i = 0; i < data.length; i++) {
    /** Example
     * https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/#api/2/project-getProjectVersions
     */
    if (!data[i].archived && !data[i].released) {
      console.log("Active - NOT Archived or Released" + JSON.stringify(data[i], null,10));
      jiraData.push([data[i].name,"UNRELEASED", data[i].userStartDate, data[i].userReleaseDate]);
    }
    else {
      console.log("Archived or Released" + JSON.stringify(data[i], null,10));
    }
  }
  return jiraData;
}

function releaseDataToSheet () {

}