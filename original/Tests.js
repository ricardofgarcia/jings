function testGetIssueLinks(issue=null){

  var issueLinks = new Map([
      ["Relates To", null],
      ["Blocks", null],
      ["Is Blocked By", null],
      ["Depends On",null]
    ]);
    
    var linkedIssues;
    //var issue.fields.issuelinks;

    for (const issueLinkType of issueLinks.keys()){
      linkedIssuesCsv = getIssueLinksOfType(issueLinkType,issueLinks);
      issueLinks.set(issueLinkType,linkedIssuesCsv);
      console.log("testGetIssueLinks: " + issueLinkType);
      console.log("testGetIssueLinks: " + linkedIssuesCsv);
    }

    //return issueLinks;
    
}