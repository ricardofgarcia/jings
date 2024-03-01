# jings - a Jira Issue Navigator for Google Sheets

Jings brings the  **J**ira **I**ssue **N**avigator functionality into **G**oogle Sheets. Just provide a JQL statement in a Google Sheet and jings will fetch and write the data in it.

Follow the instructions below to start analyzing, visualizing and reporting on Jira issues right within Google Sheets.

# To Use
## Option 1
Leverage an existing file.
* Copy the Google Sheet [jings (example)](https://docs.google.com/spreadsheets/d/1qQP1mqdSjsGSBJdXWy6PzuVepDwCboGAEMFrnpvgWZA/edit#gid=1042172636) and follow the the [prep work](prep-work.md) steps.

## Option 2
* Create a new Google Sheet with an AppScript project.
* Follow the [prep work](prep-work.md) steps.
* Create files with the same name as those in this repo and copy their content.

After that, you will be set to use or modify the tool to your needs.

# Code of interest
Here is a list of files, functions and objects you could modify to taylor the code to your needs.
| **File**  | **Symbol**    | **Type**  | **Description**   |
|---	|---	|---	|---	|
| IssueNavigatorSheet	| refreshJiraData    	| function  	| Invoke it from a Google sheet to populate it with data from Jira issues.   	|
| JiraIssueFields   | gJiraIssueFieldsMap_DisplayToId	| Map  	| Update it to add,remove and modify issue fields to fetch from Jira. 	|
| JiraIssueFields  	| gIssueLinkTypesMap  	|  Map 	|   Update it to add,remove and modify issue links to fetch from Jira.	|
