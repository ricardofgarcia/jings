function fetchUserProfileInfo(accessToken){
    var headers = { 'Authorization' : 'Bearer ' + accessToken};
    var options = {
      "async": true,
      'method' : 'GET',
      'accept': 'application/json',
//      'contentType': 'application/json',
      'headers' : headers,
      'muteHttpExceptions' : false
    };
  
    var api_url     = 'https://issues.redhat.com/rest/api/2/search?';
    var api_params  = 'jql='+jql;
    var request_url = api_url + api_params + fields + '&maxResults=' + maxResults + '&startAt=' + startAt;
  
    var response = UrlFetchApp.fetch(encodeURI(request_url), options);
  
    return response;
  }