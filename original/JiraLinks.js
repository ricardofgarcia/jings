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
  //var linkedIssues = getIssueLinksOfType(issueLinkType,issue.fields.issuelinks);
    
}


//linkedIssuesCsv = getIssueLinksOfType(issueLinkType,issue.fields.issuelinks);
function getIssueLinksOfType_old(issueLinkType=null,issueLinks=null){

  //var linkedissues = [];
  var issueLinksCsv = "none";
  console.log("getIssueLinksOfType: " + "'" + issueLinkType + "'");

  if (issueLinks != null){
    for (var issueLinkIndex in issueLinks){
      var issueLink = issueLinks[issueLinkIndex];
      if (issueLink != null){
        if (issueLink.type.name == issueLinkType){
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
  }

  return issueLinksCsv;
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
