  /**
   * TODO: Add Documentation
   */
function fetchCurrentUserProfileInfo(){
    try{
        var jiraServer  = getJiraServer();
        var jiraPAT   = getJiraPAT();
  
        var headers = getJiraApiCallHeaders(jiraPAT);
        var method  = 'GET';
        var options = getJiraApiCallOptions(method,headers);
      
        const apiPath     = "/rest/api/2/myself";
        const apiUrl      = 'https://' + jiraServer + apiPath;
  
        var userProfileInfo;
      
        var response = UrlFetchApp.fetch(encodeURI(apiUrl), options);
  /**/    
        if (response.getResponseCode() < 400) {
          //console.log("SUCCESS! " + response.getResponseCode());
          var contextText = response.getContentText();
          userProfileInfo = JSON.parse(contextText);
          var displayName = userProfileInfo.displayName;
          //console.log("displayName: %s",displayName);
          //console.log(responseData);
        }
  /**/
        return userProfileInfo;
    }catch (err) {
        // TODO (developer) - Handle exception
        //console.log('Failed with error %s', err.message);
        return null;
    }
  }

/**
 * TODO: Add Documentation
 */
function getJiraApiCallHeaders(jiraPAT){
    var headers = { 'Authorization' : 'Bearer ' + jiraPAT};
    return headers;
}

/**
 * TODO: Add Documentation
 */
function getJiraApiCallOptions(method,headers){
 
    var options = {
        "async": true,
        'method' : method,
        'accept': 'application/json',
        'contentType': 'application/json',
        'headers' : headers,
        'muteHttpExceptions' : false
      };
    return options;
}

/**
* TODO: Add Documentation
* Fetches a maximum of 1000 results.
*/
function fetchJiraIssuesInfo(jql,startAt=0,maxResults=1000){
    //try{
        var jiraData;

        var jiraServer  = getJiraServer();
        var jiraPAT   = getJiraPAT();
  
        var headers = getJiraApiCallHeaders(jiraPAT);
        var method  = 'GET';
        var options = getJiraApiCallOptions(method,headers);
      
        const apiPath     = "/rest/api/2/search";
        const apiParams  = 'jql='+jql;
        const apiUrl      = 'https://' + jiraServer + apiPath + "?";

        var fields      = getJiraFieldsToFetch_FieldId();
        var requestUrl = apiUrl + apiParams + "&fields=" + fields + '&maxResults=' + maxResults + '&startAt=' + startAt;
    
        var response = UrlFetchApp.fetch(encodeURI(requestUrl), options);
        if (response.getResponseCode() < 400) {
            var contextText = response.getContentText();
            jiraData = JSON.parse(contextText);
        }
        return jiraData;
    /*}catch (err) {
        // TODO (developer) - Handle exception
        //console.log('Failed with error %s', err.message);
        return null;
    }*/

}