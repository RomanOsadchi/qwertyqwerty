import fetch from 'node-fetch'
import dateTime from 'get-date'
import fs from 'fs'
import {args} from './config.mjs'

const loginAndPassword = args.login + ':' + args.password
const auth = "Basic " + Buffer.from(loginAndPassword).toString('base64')
const newRunName = 'TestRun via Nodejs ' + dateTime() + dateTime(true)
let runResults = []
let jsonFileAllureResults = []

//Create TestRun;
const addRunURL = args.baseURL + '/index.php?/api/v2/add_run/' + args.projectId
const newRun = await fetch (addRunURL, {
    headers: {"Content-Type": "application/json", "Authorization": auth},
    method: 'POST',
    body: JSON.stringify({
        "suite_id": args.suiteId,
        "name": newRunName,
        "assignedto_id": 1,
        "include_all": true
    })
}).then(response => response.json())

//Get created run ID;
const newRunID = newRun['id']
const getTestsURL = args.baseURL + '/index.php?/api/v2/get_tests/' + newRunID
const addTestRunResults = args.baseURL + '/index.php?/api/v2/add_results/' + newRunID
const closeTestRun= args.baseURL + '/index.php?/api/v2/close_run/' + newRunID

// Get Title and Id for each test from TestRun;
const testsFromRun = await fetch(getTestsURL, {
    headers: {"Content-Type": "application/json", "Authorization": auth},
    method: 'GET'
})
    .then(data => data.json())

//Create array with information for adding results for run
let allureResultsDir = fs.readdirSync('./allure-results')
for (let file in allureResultsDir) {
    let fileName = './allure-results' + '/' + allureResultsDir[file]
    if (fileName.includes('result.json')) {
        let file = fs.readFileSync(fileName)
        jsonFileAllureResults = JSON.parse(file)
        if (jsonFileAllureResults['status'] === 'passed') {
            jsonFileAllureResults['status'] = 1
        }
        else if (jsonFileAllureResults['status'] === 'skipped') {
            jsonFileAllureResults['status'] = 2
        }
        else if (jsonFileAllureResults['status'] === 'failed') {
            jsonFileAllureResults['status'] = 5
        }
        if (jsonFileAllureResults['status'] === 1) {
            jsonFileAllureResults['comment'] = "This test is passed"
        }
        else if (jsonFileAllureResults['status'] === 5) {
            jsonFileAllureResults['comment'] = "This test is failed"
        }
        else if (jsonFileAllureResults['status'] === 2) {
            jsonFileAllureResults['comment'] = "This test is skipped"
        }
        for (let test of testsFromRun) {
            if (jsonFileAllureResults['fullName'].includes(test['title'])) {
                runResults.push({
                    "test_id": test["id"],
                    "status_id": jsonFileAllureResults["status"],
                    "comment": jsonFileAllureResults["comment"]
                })
            }
        }
    }
}

//Post run results
const addRun = await fetch(addTestRunResults,  {
    headers: {"Content-Type": "application/json", "Authorization": auth},
    method: 'POST',
    body: JSON.stringify({"results": runResults})
})
    .then(data => data.json())

//Close TestRun
const closeRun = await fetch(closeTestRun,  {
    headers: {"Content-Type": "application/json", "Authorization": auth},
    method: 'POST'
})
    .then(data => data.json())