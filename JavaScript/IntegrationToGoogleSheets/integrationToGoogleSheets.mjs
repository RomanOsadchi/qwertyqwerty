import dateTime from 'get-date'
import fs from 'fs'
import {google} from 'googleapis'
import keys from './keys.json'
import {args} from './configGS.mjs'

let data = []
let fileName = './allure-report/data/suites.json'
data = fs.readFileSync(fileName)
data = JSON.parse(data)
let feature
let testArray = []
let suite
let url = []
let rows = 0
for (suite in data['children']) {
    suite = data["children"][suite]
    for (feature in suite["children"]) {
        feature = suite["children"][feature]
        url = "http://167.86.127.165:8080/job/" + args.jobName + "/allure/#suites/" +
            feature["parentUid"] + "/" + feature["uid"]
        testArray.push([url,
            suite["name"],
            feature["name"],
            feature["status"]])
        rows += 1
    }
}

let sheetName = dateTime() + dateTime(true)
sheetName = sheetName.replace(' ', '_')
sheetName = sheetName.replace(':', '-')
sheetName = sheetName.replace(':', '-')
sheetName = sheetName + ";"
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

client.authorize(function(err, tokens) {
    if (err) {
        return
    }
    else {
        gsrun(client)
    }
})

async function gsrun(cl) {
    const gsapi = google.sheets({version: 'v4', auth: cl})
    const createNewSheet = {
        "spreadsheetId": '1TV2TB-EiQ-ta5qFe41b2oHdYdzYqtq5fGqFsf-gAOaM',
        "resource": {
            "requests": [{
                "addSheet": {
                    "properties": {
                        "title": sheetName,
                        "gridProperties": {
                            frozen_row_count: 1,
                            "rowCount": rows + 5,
                            "columnCount": 9
                        },
                        "tabColor": {
                            "green": 1,
                        },
                    }
                }
            }]
        }
    };
    let newSheet = await gsapi.spreadsheets.batchUpdate(createNewSheet)

    const columnNamesArray = [["Links to Allure", "Suites", "Test Names", "Status", "Comments"]]
    const columnNames = {
        spreadsheetId: '1TV2TB-EiQ-ta5qFe41b2oHdYdzYqtq5fGqFsf-gAOaM',
        range: sheetName + "!A1",
        valueInputOption: 'USER_ENTERED',
        resource: {values: columnNamesArray}
    }
    let setNamesForColumns = await gsapi.spreadsheets.values.update(columnNames)

    const updateData = {
        spreadsheetId: '1TV2TB-EiQ-ta5qFe41b2oHdYdzYqtq5fGqFsf-gAOaM',
        range: sheetName + "!A2",
        valueInputOption: 'USER_ENTERED',
        resource: {values: testArray}
    }
    let enterTestResults = await gsapi.spreadsheets.values.update(updateData)

    let getSheetId = await gsapi.spreadsheets.get({"spreadsheetId": '1TV2TB-EiQ-ta5qFe41b2oHdYdzYqtq5fGqFsf-gAOaM'});
    let newSheetId
    if (getSheetId && getSheetId.data.sheets) {
        getSheetId.data.sheets.map(sheet => {
            if (sheet && sheet.properties.title === sheetName) {
                newSheetId = sheet.properties.sheetId;
            }
        })
    }

    let cellFormatting = await gsapi.spreadsheets.batchUpdate({
        "spreadsheetId": '1TV2TB-EiQ-ta5qFe41b2oHdYdzYqtq5fGqFsf-gAOaM',
        "resource": {
            "requests": [
                {
                    "repeatCell": {
                        "range": {
                            "sheetId": newSheetId,
                            "startRowIndex": 0,
                            "endRowIndex": 1,
                            "startColumnIndex": 0,
                            "endColumnIndex": 5
                        },
                        "cell": {
                            "userEnteredFormat": {
                                "horizontalAlignment" : "CENTER",
                                "textFormat": {
                                    "fontSize": 12,
                                    "bold": true
                                },
                                // "backgroundColor": { brown : 1}
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                {
                    "repeatCell": {
                        "range": {
                            "sheetId": newSheetId,
                            "startRowIndex": 1,
                            "startColumnIndex": 1,
                            "endColumnIndex": 2
                        },
                        "cell": {
                            "userEnteredFormat": {
                                "horizontalAlignment" : "CENTER",
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                {
                    "repeatCell": {
                        "range": {
                            "sheetId": newSheetId,
                            "startRowIndex": 1,
                            "startColumnIndex": 3,
                            "endColumnIndex": 4
                        },
                        "cell": {
                            "userEnteredFormat": {
                                "horizontalAlignment" : "CENTER",
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {
                            "sheetId": newSheetId,
                            "dimension": "COLUMNS",
                            "startIndex": 0,
                            "endIndex": 1
                        },
                        "properties": {
                            "pixelSize": 250
                        },
                        "fields": "pixelSize",
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {
                            "sheetId": newSheetId,
                            "dimension": "COLUMNS",
                            "startIndex": 1,
                            "endIndex": 2
                        },
                        "properties": {
                            "pixelSize": 250,

                        },
                        "fields": "pixelSize",
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {
                            "sheetId": newSheetId,
                            "dimension": "COLUMNS",
                            "startIndex": 2,
                            "endIndex": 3
                        },
                        "properties": {
                            "pixelSize": 520
                        },
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {
                            "sheetId": newSheetId,
                            "dimension": "COLUMNS",
                            "startIndex": 3,
                            "endIndex": 4
                        },
                        "properties": {
                            "pixelSize": 75
                        },
                        "fields": "pixelSize"
                    }
                },
                {
                    "addConditionalFormatRule": {
                        "rule": {
                            "ranges": [
                                {
                                    "sheetId": newSheetId,
                                    "startColumnIndex": 3,
                                    "endColumnIndex": 4,
                                }
                            ],
                            "booleanRule": {
                                "condition": {
                                    "type": "TEXT_CONTAINS",
                                    "values": [
                                        {
                                            "userEnteredValue": "passed"
                                        }
                                    ]
                                },
                                "format": {
                                    "backgroundColor": {
                                        "green": 1,
                                        "red": 0.2,
                                        "blue": 0.4
                                    }
                                }
                            }
                        },
                        "index": 0
                    }
                },
                {
                    "addConditionalFormatRule": {
                        "rule": {
                            "ranges": [
                                {
                                    "sheetId": newSheetId,
                                    "startColumnIndex": 3,
                                    "endColumnIndex": 4,
                                }
                            ],
                            "booleanRule": {
                                "condition": {
                                    "type": "TEXT_CONTAINS",
                                    "values": [
                                        {
                                            "userEnteredValue": "skipped"
                                        }
                                    ]
                                },
                                "format": {
                                    "backgroundColor": {
                                        green: 1,
                                        blue: 1
                                    }
                                }
                            }
                        },
                        "index": 0
                    }
                },
                {
                    "addConditionalFormatRule": {
                        "rule": {
                            "ranges": [
                                {
                                    "sheetId": newSheetId,
                                    "startColumnIndex": 3,
                                    "endColumnIndex": 4,
                                }
                            ],
                            "booleanRule": {
                                "condition": {
                                    "type": "TEXT_CONTAINS",
                                    "values": [
                                        {
                                            "userEnteredValue": "failed"
                                        }
                                    ]
                                },
                                "format": {
                                    "backgroundColor": {
                                        "red": 0.9,
                                        "blue": 0.2,
                                        "green": 0.2
                                    }
                                }
                            }
                        },
                        "index": 0
                    }
                }
            ]
        }
    })
}