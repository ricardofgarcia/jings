const gLinkDirection_Outward = 0;
const gLinkDirection_Inward = 1;

/**
 * Provides a list of issue types to process
 */
const gIssueLinkTypesMap = new Map([
    ["blocks", gLinkDirection_Outward],
    ["is blocked by",gLinkDirection_Inward],
    ["relates to", gLinkDirection_Outward],
    ["is related to",gLinkDirection_Inward],
    ["depends on", gLinkDirection_Outward],
    ["is depended on by", gLinkDirection_Inward],
    ["impacts account", gLinkDirection_Outward],
  ]);

function getSpecificIssueLinks(issueLinks,issueLinkTypes=null){

  if (issueLinkTypes == null) { issueLinkTypes = gIssueLinkTypesMap; }

  var issueLinkValues = new Map(issueLinkTypes);

  for (const issueLinkType of gIssueLinkTypesMap.keys()){
    linkedIssuesCsv = getIssueLinksOfType(issueLinkType,issueLinks);
    issueLinkValues.set(issueLinkType,linkedIssuesCsv.replaceAll(",",String.fromCharCode(10)))
    console.log("getIssueLinks: " + issueLinkType);
    console.log("getIssueLinks: " + linkedIssuesCsv);
  }

  return issueLinkValues;
  //var linkedIssues = getIssueLinksOfType(issueLinkType,issue.fields.issuelinks);
    
}

/**
 * @returns {Object}    an map of issue types in the form {"Issue Type Name" : [issue1, issue2,..., issueN] }
 */
function getAllIssueLinks(issueLinks){

  console.log("getAllIssueLinks ...");
  console.log(issueLinks);

/*

  if (issueLinkTypes == null) { issueLinkTypes = gIssueLinkTypesMap; }

  var issueLinkValues = new Map(issueLinkTypes);


  for (const issueLinkType of gIssueLinkTypesMap.keys()){
    linkedIssuesCsv = getIssueLinksOfType(issueLinkType,issueLinks);
    issueLinkValues.set(issueLinkType,linkedIssuesCsv.replaceAll(",",String.fromCharCode(10)))
    console.log("getIssueLinks: " + issueLinkType);
    console.log("getIssueLinks: " + linkedIssuesCsv);
  }

  return issueLinkValues;
  //var linkedIssues = getIssueLinksOfType(issueLinkType,issue.fields.issuelinks);

*/

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
