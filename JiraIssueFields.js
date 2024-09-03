/**
 * Some tips:
 *  - To add a field to fetch: add an entry with [<DISPLAY_NAME>,<FIELD_ID>] and set its "getter"
 *  - To remove a field from being fetched: comment out the line containing the field info
 *  - To change the order in which fields are displayed: change the order of the elements in the map
 */
//Fields Map: Display Name to Field ID
const gJiraIssueFieldsMap_DisplayToId = new Map([
  ['Key' , 'key'],            //leave key at the beginning of the map so that info can be retrieved via key
  ['Type' , 'issuetype'],
  ['Summary' , 'summary'],
  ['Status' , 'status'],
  ['Color Status','customfield_12320845'],
  ['Assignee' , 'assignee'],
  ['Priority' , 'priority'],
  ['Fix Version(s)' , 'fixVersions'],
  ['Labels' , 'labels'],
  ['Resolution' , 'resolution'],
  ['Updated' , 'updated'],
  ['Reporter' , 'reporter'],
  ['Components' , 'components'],
  ['Target Start Date' , 'customfield_12313941'],
  ['Target End Date' , 'customfield_12313942'],
  ['Planning Target','customfield_12319440'],
  ['Target Version','customfield_12319940'],
  ['Hierarchy Progress','customfield_12317140'],
  ['Due Date','duedate'],
  ['Resolution Date','resolutiondate'],
  ['QA Contact' , 'customfield_12315948'],
  ['Product Manager' , 'customfield_12316752'],
  ['Developer','customfield_12315141'], //Developer = Feature Lead
  ['Blocked' , 'customfield_12316543'],
  ['Parent Link' , 'customfield_12313140'],
  ['Epic Link' , 'customfield_12311140'],
  ['T-Shirt Size' , 'customfield_12316541'],
  ['Story Points' , 'customfield_12310243'],
  ['Release Blocker','customfield_12319743'],
  ['Current Status','customfield_12317320'],
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
function getJiraFieldsToFetch_FieldId_asArray(){
  var fields = [];

  for (const [key, value] of gJiraIssueFieldsMap_DisplayToId.entries()) {
    fields.push(value);
  }

  return fields;
}

function getJiraFieldsToFetch_FieldId_AsCsv(){
  var fields = "";

  for (const [key, value] of gJiraIssueFieldsMap_DisplayToId.entries()) {
    if (fields == "") { fields = value;}
    else { fields += "," + value; }
  }

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
    //skip "Issue Links"
    if (key != "Issue Links") { displayNames.push(key); }
  }
 
  //issue links
  for (const issueLinkType of gIssueLinkTypesMap.keys()){
    displayNames.push(issueLinkType);
  }
 
  //console.log(displayNames);
  
  return displayNames;
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
      for (const fieldId of gJiraIssueFieldsMap_IdToDisplay.keys()){

        fieldValue = "";
        if (fieldId == "key"){
          fieldValue = issue.key;
        }else if (issue.fields[fieldId] != null){
          //get the field value from the Jira issue
          fieldValue = getJiraIssueFieldValue(fieldId,issue);
        }
        
        if (fieldId != "issuelinks"){
          fieldValues.set(fieldId,fieldValue);
        }
        else{
          //process the issue links
          var issueLinksMap = fieldValue;
          var linkedIssuesCsv = null;
              for (const issueLinkType of issueLinksMap.keys()){
                linkedIssuesCsv = issueLinksMap.get(issueLinkType);
                fieldValues.set(issueLinkType,linkedIssuesCsv);
              }
          }
        console.log("%s = %s",fieldId,fieldValue);
      }
    var jiraDataRecord = Array.from(fieldValues.values());

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

//field value is the field itself
//-->
    case "customfield_12317140": //Hierarchy Progress
    case 'duedate': //'Due Date'
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
    case "customfield_12320845": //['Color Status','customfield_12320845'],
    case "customfield_12317320": //['Current Status','customfield_12317320'],
    case "customfield_12316543": //blocked
    case "customfield_12316541": //tShirtSize
    case 'customfield_12319743': //'Release Blocker'
      fieldValue = jiraIssue.fields[fieldId].value;
      break;
// --- field value is the email address
    case "customfield_12315948":  //QA Contact 
    case "customfield_12315141":  //['Developer','customfield_12315141'], //Developer = Feature Lead
    case "customfield_12316752":  //['Product Manager' , 'customfield_12316752'],
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
    case 'resolutiondate': //  ['Resolution Date','resolutiondate'],
      fieldValue = jiraIssue.fields[fieldId].split("T")[0];
      break;
// ---
    case "poolTeam":
    case 'customfield_12319440': //Planning Target
      if(jiraIssue.fields[fieldId].length == 0) { fieldValue = ""; }
      else{ fieldValue = getFieldArrayValuesAsCsv(jiraIssue.fields[fieldId],"value"); }
      break;
// ---
    case "components":
    case "fixVersions":
    case 'customfield_12319940':  //Target Version
      if(jiraIssue.fields[fieldId].length == 0) { fieldValue = ""; }
      else{ fieldValue = getFieldArrayValuesAsCsv(jiraIssue.fields[fieldId],"name");}
      break;
// ---
    case "sprint":
      fieldValue = getSprintfromJiraIssue(jiraIssue.fields[fieldId]);
      break;
// ---
    case "issuelinks":
      fieldValue = getSpecificIssueLinks(jiraIssue.fields[fieldId]);
      //fieldValue = getAllIssueLinks(jiraIssue.fields[fieldId]);
      break;
    default:
      // code block
      fieldValue = "";
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

