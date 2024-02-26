# jings - a Jira Issue Navigator for Google Sheets

Having Jira data in Google Sheets opens a world of possibilities to analyze, report and visualize data about Jira and projects.

This project provides a **J**ira client for the **I**ssue **N**avigator functionality in **G**oogle Sheets. 

# Assumptions
1. You already have a Google AppScript Project attached to a Google Sheets. If not, follow these [instructions](https://spreadsheet.dev/creating-your-first-apps-script) to create one.
2. You have a jira account and are able to obtain a Personal Access Token to interact with the Jira API.

# Prep Work
- Login to your Jira instance and [generate a Jira Personal Access Token](#generate-a-jira-personal-access-token).
- [Store the Personal Access Token as a property](add-properties-to-a-google-appscript-project) in the Google Apps Script Project.
    - Name the property ***"JiraPAT"*** (Jira **P**ersonal **A**ccess **T**oken)
- Store the Jira server as a property.
    - Name the property ***"JiraServer"***.
- [Test your setup](#test-your-setup)

## Generate a Jira Personal Access Token
1. Select your profile picture at the top right of the screen, then choose Profile. Once you access your profile, select Personal Access Tokens in the left-hand menu.
2. Select Create token.
3. Give your new token a name.
4. Optionally, for security reasons, you can set your token to automatically expire after a set number of days.
* See the article [Using Personal Access Tokens](https://confluence.atlassian.com/enterprise/using-personal-access-tokens-1026032365.html) for additional information.

## Add properties to a Google AppScript Project
1. Open your Apps Script project.
2. At the left, click Project Settings The icon for project settings.
3. Under Script Properties, click "Add script property".
4. For Property, enter the key name.
5. For Value, enter the value for the key.
6. Click Save script properties.
* See the article [Add script properties](https://developers.google.com/apps-script/guides/properties#add_script_properties) for additional info.
## Test Your Setup
1. Check that the Jira Personal Access Token [has been set](#check-for-personal-access-token).
2. Check that the Jira Server [has been set](#check-for-jira-server).
3. Check that you [can connect](check-for-connectivity-to-jira-server) to your Jira server with the information provided.

### Check for Personal Access Token
- Open the **Tests** file then run the function **test_getJiraPAT()**.
    - if successful you will see your PAT
    - if not, you'll see an error message

### Check for Jira Server
- Open the **Tests** file then run the function **test_getJiraServer()**.
    - if successful you will see your Jira Server name
    - if not, you'll see an error message

### Check for connectivity to Jira Server
- Open the **Tests** file then run the function **test_fetchCurrentUserProfileInfo()**.
    - if successful you will see the display name for your Jira account
    - if not, you'll see an error message