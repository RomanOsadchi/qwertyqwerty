# utils

###### **_How to use integrationToGoogleSheets.mjs:_**

1. For environment installation:
   
    `npm init -y` - for creating package.json
   
    `npm i date-time` - for installation 'date-time' library
   
    `npm i fs` - for installation 'fs' library

    `npm install googleapis@39 --save` - for installation 'googleapi' library
   
    `npm i minimist` - for installation 'minimist' library

2. You should have at '/util' directory last version of allure-results folder. You can just copy allure-results from other 
   job to this project. If you would like to copy allure-results from other job at Jenkins you need to create new job for 
   Results Integration to GoogleSheets (You have to create parameterize job: jobName). 

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
   
      `node --experimental-json-modules --unhandled-rejections=strict **/integrationToGoogleSheets.mjs --jobName="$jobName"`

3. Load keys.json file to 'IntegrationToGoogleSheets' folder:
   
    3.1 Go to: https://console.cloud.google.com/ and select or create your project;
   
    3.2 Go to 'Explore and enable APIs' tab at https://console.cloud.google.com/. Then click 'Credentials' tab at left bar, 
   create service account and load JSON file with keys for this account;
   
    3.3 Load JSON file with keys to your project;

    3.4 Make sure that your project have permission for changing via API and your service account have permission for edit your GoogleSheet;

4. For running integrationToGoogleSheets.mjs:

      `node --experimental-json-modules --unhandled-rejections=strict **/integrationToGoogleSheets.mjs --jobName=jobName`

### _**In this way for locally start integrationToGoogleSheets.mjs at you machine you need (if you have here allure-results folder - step 2; if you have here keys.json file - step 3):**_

- `npm init -y` 

- `npm i date-time` 
   
- `npm i fs` 

- `npm install googleapis@39 --save` 
   
- `npm i minimist` 

- `node --experimental-json-modules --unhandled-rejections=strict **/integrationToGoogleSheets.mjs --jobName=jobName`

###### **_Some more important words about 'node integrationToGoogleSheets.mjs' command:_**
1. Here we have:

    `--jobName=jobName` - your Job Name for creating correct link to Allure


2. Example of using above command for locally start at your machine:

    `node --experimental-json-modules --unhandled-rejections=strict **/integrationToGoogleSheets.mjs --jobName=TestRail_Integration_A.K.`