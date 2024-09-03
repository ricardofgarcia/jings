  /**
   * Fetches the profile info of the personal access token owner.
   * 
   * @returns {Object}        - An object with the user profile or null if there was a failure obtaining it
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

        if (response.getResponseCode() < 400) {
          //console.log("SUCCESS! " + response.getResponseCode());
          var contextText = response.getContentText();
          userProfileInfo = JSON.parse(contextText);
          var displayName = userProfileInfo.displayName;
          //console.log("displayName: %s",displayName);
          //console.log(responseData);
        }

        return userProfileInfo;
    }catch (err) {
        // TODO (developer) - Handle exception
        //console.log('Failed with error %s', err.message);
        return null;
    }
  }

/**
 * Gets headers needed for API call
 * 
 * @param   {String} jiraPAT  - Personal Access token of a Jira user
 * @returns {Object}          - A key-value pair of header properties
 */
function getJiraApiCallHeaders(jiraPAT){
    var headers = { 'Authorization' : 'Bearer ' + jiraPAT};
    return headers;
}

/**
 * Gets options needed to make API call
 * @returns                 - A key-value pair of header properties
 */
function getJiraApiCallOptions(method,headers,data=null){

  var options;

  options = {
      "async": true,
      'method' : method,
      'accept': 'application/json',
      'contentType': 'application/json',
      'headers' : headers,
      'muteHttpExceptions' : true
    };

    if (data != null){
      options['payload'] = JSON.stringify(data);
    }

    return options;
}

/**
* TODO: Add Documentation
* By default, it fetches a maximum of 1000 results.
*/
/**
 * Fetches info about issues returned by the given jql.
 * 
 * @param     jql         - A Jira Query Language statement
 * 
 * @returns   {Object}    - An object containing the information returned by the API
 * 
 * @throws                - Passes through exceptions thrown by called functions
 */
function fetchJiraIssuesInfo(jql,startAt=0,maxResults=1000){

      var jiraData;

      var jiraServer  = getJiraServer();
      var jiraPAT   = getJiraPAT();

      var headers = getJiraApiCallHeaders(jiraPAT);
      var fields      = getJiraFieldsToFetch_FieldId_asArray();
      var method  = 'POST';

      var data = {};
      data["jql"]         = jql;
      data["fields"]      = fields;
      data["startAt"]     = startAt;
      data["maxResults"]  = maxResults;        

      var options = getJiraApiCallOptions(method,headers,data);

      const apiPath     = "/rest/api/2/search";
      //const apiParams  = 'jql='+jql;

      const apiUrl      = 'https://' + jiraServer + apiPath;
      //var requestUrl = api_url;

      //var requestUrl = apiUrl + apiParams + "&fields=" + fields + '&maxResults=' + maxResults + '&startAt=' + startAt;
  
      var response = UrlFetchApp.fetch(encodeURI(apiUrl), options);
      if (response.getResponseCode() < 400) {
          var contextText = response.getContentText();
          jiraData = JSON.parse(contextText);
      }
      return jiraData;
}

/**
* TODO: Add Documentation
* By default, it fetches a maximum of 1000 results.
*/
/**
 * Fetches info about issues returned by the given jql. Good for short JQL statements since it uses the "GET" method.
 * 
 * @param     jql         - A Jira Query Language statement
 * 
 * @returns   {Object}    - An object containing the information returned by the API
 * 
 * @throws                - Passes through exceptions thrown by called functions
 */

function fetchJiraIssuesInfo_UsingGet(jql,startAt=0,maxResults=1000){
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
