import os
import json

os.chdir('./allure-results')
file_list = os.listdir()
for file in file_list:
    # print(file)
    if "result.json" in file:
        # print(file)
        with open(file) as jsonFile:
            text = json.load(jsonFile)
            # print(text)
        if text.get('status') == 'skipped':
#             print(file)
            os.remove(file)



# print(os.listdir())
