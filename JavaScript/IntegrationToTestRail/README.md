# utils

###### **_How to use integrationToTestrail.mjs:_**

1. For environment installation:
   
    `npm init -y` - for creating package.json
   
    `npm i node-fetch` - for installation 'node-fetch' library
   
    `npm i date-time` - for installation 'date-time' library
   
    `npm i fs` - for installation 'fs' library
   
    `npm i minimist` - for installation 'minimist' library

2. You should have at '/util' directory last version of allure-results folder. You can just copy allure-results from other 
   job to this project. If you would like to copy allure-results from other job at Jenkins you need to create new job for 
   Results Integration to TestRail (You have to create parameterize job: baseurl, projectid, suiteid, login, password). 

   2.1 Before the first run of this job at Jenkins you should have next folders or create them at your project:
     
      * 2.1.1 allure-results (allure-results must include 'history' folder). Commands are below:
        
         `mkdir allure-results`
        
         `cd allure-results`
        
         `mkdir history`
        
         `cd ..`
   
      * 2.1.2 allure-report (allure-report must include 'history' folder). Commands are below:
   
         `mkdir allure-report`
        
         `cd allure-report`
        
         `mkdir history`
        
        ` cd ..`
   
   2.2 Shell commands for job at Jenkins if you run this job the second time:
   
      `npm install`
   
      `rm -f allure-results/*.json`
   
      `mv -f allure-report/history/* allure-results/history/`
   
      `cp -r /var/lib/jenkins/workspace/NameOfMainJobWhereYouHaveAllureResultsFolder/* /var/lib/jenkins/workspace/NameOfNewJobForResultsIntegration/`
   
      `node **/integrationToTestrail.mjs --suiteid="$SuiteID" --baseurl="$BaseURL" --login="$Login" --password="$Password" --projectid="$ProjectID"`

3. For running integrationToTestrail.mjs:

    `node **/integrationToTestrail.mjs --baseurl=yourTestRailURL --login=yourEmail --password=yourPassword --projectid=project_id --suite=suite_id`

###### _**In this way for locally start integrationToTestrail.mjs at you machine you need (if you have here allure-results folder - step 2):**_

- `npm init -y`

- `npm i node-fetch` 
   
- `npm i date-time` 
   
- `npm i fs` 
   
- `npm i minimist` 

- `node **/integrationToTestrail.mjs --suiteid="$SuiteID" --baseurl="$BaseURL" --login="$Login" --password="$Password" --projectid="$ProjectID"`

###### **_Some more important words about 'node integrationToTestrail.mjs' command:_**
1. Here we have:

    `--baseurl=yourTestRailURL` - your TestRail URL (we use URL which we wrote when were creating TestRail project)

    `--login=yourEmail` - email

    `--password=yourPassword` - password

    `--projectid=project_id` - project id number (we use project id number for creating TestRun)

    `--suiteid=suite_id` - suite id number (we use suite id number for creating TestRun)

2. Example of using above command for locally start at your machine:

    `node **/integrationToTestrail.mjs --baseurl=https://crexiqa.testrail.io --login=al.khamitski@gmail.com --password=Password123! --projectid=1 --suite=1`