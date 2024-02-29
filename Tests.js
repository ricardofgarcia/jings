function test_getJiraServer(){
  const jiraServer = getJiraServer();
  if (jiraServer == null){
    console.log("ERROR: Please store your Jira Server name in the project property JiraServer");
  }
  else{
    console.log("SUCCESS: Your Jira Server is '%s'",jiraServer);
  }
}

function test_getJiraPAT(){
  const jiraPAT = getJiraPAT();
  if (jiraPAT == null){
    console.log("ERROR: Please store your Jira Personnal Access Token in the project property JiraPAT");
  }
  else{
    console.log("SUCCESS: Your Jira Personnal Access Token is '%s'",jiraPAT);
  }
}

function test_fetchCurrentUserProfileInfo(){
  const currentUserProfileInfo = fetchCurrentUserProfileInfo();
  if (currentUserProfileInfo == null){
    console.log("ERROR: Unable to connect to Jira to fetch the current user profile info. Please check your project property settings.");
  }
  else{
    console.log("SUCCESS: Your display name '%s'",currentUserProfileInfo.displayName);
  }
}

function test_fetchJiraIssuesInfo(){

    const jql = getJiraTestJql();
    //const jql = "project = XCMSTRAT AND issueFunction in commented('after 2024/01/31 before 2024/02/07') AND resolution is not EMPTY";

    const jiraIssuesInfo = fetchJiraIssuesInfo(jql);
    if (jiraIssuesInfo == null){
      console.log("ERROR: Unable to fetch issues from Jira. Make sure your JiraTestJql statement is correct.");
    }
    else{
        console.log("SUCCESS: info about %d Jira issues fetched",jiraIssuesInfo.issues.length);
    }

    return jiraIssuesInfo;
}

function test_processJiraResponseData(responseData,processedJiraData){
  var jiraIssuesInfo = test_fetchJiraIssuesInfo();
  var processedJiraData = getJiraFieldsToFetch_DisplayName();
  processJiraResponseData(jiraIssuesInfo,processedJiraData);
}

function test_refreshJiraData(){
  var testSheetName = "test-issue-navigator";
  refreshJiraData(testSheetName);
}
