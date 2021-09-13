import requests
import json
import os
import datetime

now = datetime.datetime.today()

os.chdir('./allure-results')
user = {
    'user': 'romys54@yandex.ru',
    'password': '42551727'
}
crexi = {
    "id": 1,
    'run_id': 8
}
projects = [crexi]
name_of_run = 'crexi_run(roma) ' + str(now.strftime("%d-%m-%Y %H:%M"))

print(name_of_run)
run = {
    'name': name_of_run,
    'description': "Roma's test run"
}
baseUrl = 'https://crexiqa.testrail.io/index.php?/api/v2'
HEADER = {"Content-Type": "application/json"}

######################################################################################
s = requests.Session()
add_run_response = s.post(url=baseUrl + f'/add_run/{crexi["id"]}',
                          headers=HEADER,
                          auth=(user['user'], user['password']),
                          json=run)
run_data = add_run_response.json()
print("Created run response - " + str(add_run_response.status_code))
crexi["run_id"] = int(run_data.get('id'))
# print(crexi.get("run_id"))

LIST_OF_CASES = s.get(url=(baseUrl + f'/get_tests/{crexi["run_id"]}'),
                      headers=HEADER,
                      auth=(user['user'], user['password']))
print("list of tests response - " + str(LIST_OF_CASES.status_code))
#
# for case in LIST_OF_CASES.json():
#     print(case)
run_results = []
file_list = os.listdir()
for file in file_list:
    # print(file)
    if "result.json" in file:
        # print(file)
        with open(file) as jsonFile:
            text = json.load(jsonFile)
            # print(text["fullName"])
            # print(text["status"])
        if text.get('status') == 'passed':
            status = 1
        elif text.get('status') == 'failed':
            status = 5
        elif text.get('status') == 'skipped':
            status = 2
        if status == 1:
            comment = "this test passed"
        elif status == 5:
            comment = "this test failed"
        elif status == 2:
            comment = "this test is skipped"
        for case in LIST_OF_CASES.json():
            if case.get('title') in text.get('fullName'):
                run_results.append({
                    'test_id': case.get('id'),
                    'status_id': status,
                    'comment': comment
                })
print(run_results)

set_results_response = s.post(url=(baseUrl + f'/add_results/{crexi["run_id"]}'),
                              headers=HEADER,
                              auth=(user['user'], user['password']),
                              json={"results": run_results})
print("Add results response - " + str(set_results_response.status_code))
close_run_response = s.post(url=baseUrl + f'/close_run/{crexi["run_id"]}',
                            headers=HEADER,
                            auth=(user['user'], user['password']))
print("Close run response - " + str(close_run_response.status_code))
