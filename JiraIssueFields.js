
//TODO: Add some instructios on how to add/remove fields, change their order, etc...
/**
 * Some tips:
 *  - To add a field to fetch: add an entry with [<DISPLAY_NAME>,<FIELD_ID>]
 *  - To remove a field from being fetched: comment out the line containing the field info
 *  - To change the order in which fields are displayed: change the order of the elements in the map
 */
//Fields Map: Display Name to Field ID
const gJiraIssueFieldsMap_DisplayToId = new Map([
  ['Key' , 'key'],            //leave key at the beginning of the map so that info can be retrieved via key
  ['Type' , 'issuetype'],
  ['Summary' , 'summary'],
  ['Status' , 'status'],
  ['Assignee' , 'assignee'],
//  ['Description' , 'description'],
  ['Priority' , 'priority'],
  ['Fix Version(s)' , 'fixVersions'],
  ['Labels' , 'labels'],
  ['Resolution' , 'resolution'],
  ['Updated' , 'updated'],
  ['Reporter' , 'reporter'],
  ['Components' , 'components'],
  ['Target Start Date' , 'customfield_12313941'],
  ['Target End Date' , 'customfield_12313942'],
  ['Blocked' , 'customfield_12316543'],
  ['Parent Link' , 'customfield_12313140'],
  ['Epic Link' , 'customfield_12311140'],
  ['T-Shirt Size' , 'customfield_12316541'],
  ['Story Points' , 'customfield_12310243'],
//  ['Original Story Points' , 'customfield_12314040'],
//  ['Pool Team' , 'customfield_12317259'],
//  ['Sprint ' , 'customfield_12310940'],
  ['Issue Links' , 'issuelinks']
]);

//Fields Map: Field ID to Display Name
var gJiraIssueFieldsMap_IdToDisplay;

/**
 * Initialize our field maps
 */
initFieldMaps();

function initFieldMaps(){
  gJiraIssueFieldsMap_IdToDisplay = new Map();
  
  // initialize the gJiraIssueFieldsMap_IdToDisplay
  //reverse Field Display [name] to [field] Id 
  for (let [key, value] of gJiraIssueFieldsMap_DisplayToId.entries()) {
      gJiraIssueFieldsMap_IdToDisplay.set(value, key);
  }
}

function checkIssueFieldMaps(){
  console.log("Display Name to Field ID")
  gJiraIssueFieldsMap_DisplayToId.forEach ((value, key) => {
    console.log(key + ': ' + value);
  });

  console.log("");

  console.log("Field ID to Display Name")

  gJiraIssueFieldsMap_IdToDisplay.forEach ((value, key) => {
    console.log(key + ': ' + value);
  });
}

/**
 * returns Jira issue fields to fetch
 * TODO: Make fields configurable - read from somewhere in the Google Sheet (or equivalent)
*/
function getJiraFieldsToFetch_FieldId(){
  var fields = "";

  for (const [key, value] of gJiraIssueFieldsMap_DisplayToId.entries()) {
    if (fields == "") { fields = value;}
    else { fields += "," + value; }
  }

  //console.log(fields);

  return fields;
}

/**
 * Returns an array containing the display name of the fields being fetched by the API
 * TODO: Make fields configurable - read from somewhere in the Google Sheet (or equivalent)
*/
function getJiraFieldsToFetch_DisplayName(){
  var displayNames = [];

  //regular fields
  for (const [key, value] of gJiraIssueFieldsMap_DisplayToId.entries()) {
    displayNames.push(key);
  }
 
  //issue links
  for (const issueLinkType of gIssueLinkTypesMap.keys()){
    displayNames.push(issueLinkType);
  }
 
  //console.log(displayNames);
  
  return displayNames;
}

//TODO: Add some instructios on how to add/remove fields, change their order, etc...
const gLinkDirection_Outward = 0;
const gLinkDirection_Inward = 1;

const gIssueLinkTypesMap = new Map([
    ["blocks", gLinkDirection_Outward],
    ["is blocked by",gLinkDirection_Inward],
    ["relates to", gLinkDirection_Outward],
    ["is related to",gLinkDirection_Inward],
    ["depends on", gLinkDirection_Outward]
  ]);

function getIssueLinks(issueLinks){

  var issueLinkValues = new Map(gIssueLinkTypesMap);

  for (const issueLinkType of gIssueLinkTypesMap.keys()){
    linkedIssuesCsv = getIssueLinksOfType(issueLinkType,issueLinks);
    issueLinkValues.set(issueLinkType,linkedIssuesCsv.replaceAll(",",String.fromCharCode(10)))
    console.log("getIssueLinks: " + issueLinkType);
    console.log("getIssueLinks: " + linkedIssuesCsv);
  }

  return issueLinkValues;
}

function getIssueLinksOfType(issueLinkType=null,issueLinks=null){
  var issueLinksCsv = "none";
  console.log("getIssueLinksOfType: " + "'" + issueLinkType + "'");

  if (issueLinks != null){
      for (var issueLinkIndex in issueLinks){
        var issueLink = issueLinks[issueLinkIndex];
        if (issueLink != null){
            var issueLinkValue = "";
            if (issueLink.type.inward == issueLinkType && issueLink.inwardIssue != null){
              issueLinkValue = issueLink.inwardIssue.key;
            }
            else if (issueLink.type.outward == issueLinkType && issueLink.outwardIssue != null){
              issueLinkValue = issueLink.outwardIssue.key; 
            }

            if (issueLinkValue != ""){
              if (issueLinksCsv == "none"){
                  issueLinksCsv = issueLinkValue; 
              }                    
              else{
                  issueLinksCsv = issueLinksCsv + "," + issueLinkValue;
              }
            }
          }
        }
      }
  return issueLinksCsv;
}

/**
 * This function returns the data processed from the response
 */
function processJiraResponseData(responseData,processedJiraData){
  var data = responseData;
  var jiraData = processedJiraData;
  var fieldValues;
  var fieldValue = "";

  //iterate over each jira issue and get the data of interest
  for (var issueskey in data["issues"]){
    issue = data["issues"][issueskey];

    fieldValues = new Map();
    //loop through the fields we are interested in and extract their value
// CONTINUE HERE...
      for (const fieldId of gJiraIssueFieldsMap_IdToDisplay.keys()){

        fieldValue = "";
        if (fieldId == "key"){
          fieldValue = issue.key;
        }else if (issue.fields[fieldId] != null){
          //get the field value from the Jira issue
          fieldValue = getJiraIssueFieldValue(fieldId,issue);
          //fieldValue = getJiraIssueFieldValue(fieldId,issue.fields[fieldId]);
        }
        fieldValues.set(fieldId,fieldValue);
        console.log("%s = %s",fieldId,fieldValue);
      }
    var jiraDataRecord = Array.from(fieldValues.values());
    /*[parentLink,epicLink,issueType,key,summary,status,assignee,issueLinksCsv,description,sprint,storyPoints,resolution,labels,priority,originalStoryPoints,poolTeam,components,updated,reporter,fixVersions,targetStartDate,targetEndDate,blocked,tShirtSize];*/

    jiraData.push(jiraDataRecord);
  }

  return jiraData;
}


function getJiraIssueFieldValue(fieldId,jiraIssue){

  var fieldValue = "";

  switch(fieldId) {
// --- field value is the field itself
    case "summary":
    case "customfield_12313941": //targetStartDate
    case "customfield_12313942": //targetEndDate
    case "customfield_12313140": //parentLink
    case "customfield_12311140": //epicLink
    case "customfield_12310243": //storyPoints
    case "customfield_12314040": //originalStoryPoints
      fieldValue = jiraIssue.fields[fieldId];
      break;
// --- field value is a substring
    case "description":
      fieldValue = jiraIssue.fields[fieldId].substring(256);
      break;
// --- field value is the field name
    case "issuetype":
    case "status":
    case "resolution":
    case "priority":
      fieldValue = jiraIssue.fields[fieldId].name;
      break;
// --- field value is the value itself
    case "blocked":
    case "customfield_12316541": //tShirtSize
      fieldValue = jiraIssue.fields[fieldId].value;
      break;
// --- field value is the email address
    case "reporter":
    case "assignee":
      fieldValue = jiraIssue.fields[fieldId].emailAddress;
      break;
// ---
    case "labels":
      fieldValue = jiraIssue.fields[fieldId].join("|");
      break;
// ---
    case "updated":
      fieldValue = jiraIssue.fields[fieldId].split("T")[0];
      break;
// ---
    case "poolTeam":
      if(jiraIssue.fields[fieldId].length == 0) { fieldValue = ""; }
      else{ fieldValue = getFieldArrayValuesAsCsv(jiraIssue.fields[fieldId],"value"); }
      break;
// ---
    case "components":
    case "fixVersions":
      if(jiraIssue.fields[fieldId].length == 0) { fieldValue = ""; }
      else{ fieldValue = getFieldArrayValuesAsCsv(jiraIssue.fields[fieldId],"name");}
      break;
// ---
    case "sprint":
      fieldValue = getSprintfromJiraIssue(jiraIssue.fields[fieldId]);
      break;
    default:
      // code block
      fieldValue = "";
      //fieldValue = "value for '" + fieldId + "'";
  }

  return fieldValue;
}

function getFieldArrayValuesAsCsv(jiraArrayField,key="value"){
  var arrayFieldElement;
  var arrayFieldElementDict;

  var value;
  var valuesCsv = "";

  for (arrayFieldElement in jiraArrayField){
    arrayFieldElementDict = jiraArrayField[arrayFieldElement];
    value = arrayFieldElementDict[key];
    if (valuesCsv == ""){valuesCsv=value;}else{valuesCsv=valuesCsv + "," + value}
  }

  return valuesCsv;
}

/**
 * Gets the list of sprints from the jira issue field
 */
function getSprintfromJiraIssue(sprints){
        var sFieldValue;
        var aFieldValues = [{}];
        sFieldValues   = sprints[sprints.length -1]; //picking the last sprint
        aFieldValues  = sFieldValues.split(",");
        var sKeyValue,sKey,sValue;
        var aKeyValues = [{}];

        //var sprints = issue.fields["customfield_12310940"];
        //sFieldValues   = issue.fields["customfield_12310940"][sprints.length -1]; //picking the last sprint
        //sFieldValues   = issue.fields["customfield_12310940"][0]; //picking the first sprint

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

