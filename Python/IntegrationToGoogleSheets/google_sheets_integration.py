import json
import datetime
import gspread
import os
from gspread_formatting import *
import argparse

parser = argparse.ArgumentParser()
# Constants
SHEET_ID = "1c31sKveLbp-DCzwZOmySL4MvEOl3pTTAMgP4bZcyRB8"
CRED_FILE = 'GScreds_example.json'
# params

parser.add_argument('--buildUrl', '-b')

args = parser.parse_args()

JOB_URL = f'{args.buildUrl}/allure/#suites'

##############################################################################################################
now = datetime.datetime.today()
gc = gspread.service_account(filename='GScreds_example.json')
wks = gc.open_by_key(SHEET_ID)
rows = 3
with open('./allure-report/data/suites.json') as suitfile:
    suits = json.load(suitfile).get('children')
for suit in suits:
    for case in suit.get('children'):
        rows += 1
worksheet = wks.add_worksheet(title=now.strftime("%d-%m-%Y %H:%M"), rows=rows, cols="20")
cells = ['A1', 'B1', 'C1', 'D1', 'E1']
values = ['Links to allure', 'Suite', 'Test Case', 'Status', 'Comment']
for cell in cells:
    worksheet.update(cell, values[cells.index(cell)])
    worksheet.format(cell, {
        "textFormat": dict(bold=True, fontSize=12),
        "horizontalAlignment": "CENTER"
    })
set_frozen(worksheet, rows=1)
set_column_width(worksheet, 'A', 300)
set_column_width(worksheet, 'B', 250)
set_column_width(worksheet, 'C', 400)
set_column_width(worksheet, 'E', 250)
os.chdir('./allure-report/data')
results_list = os.listdir()
count = 1
with open('suites.json') as suitfile:
    suits = json.load(suitfile).get('children')
cases_results = []
for suit in suits:
    for case in suit.get('children'):
        count += 1
        link = JOB_URL + f'/{case.get("parentUid")}/{case.get("uid")}'
        cases_results.append([link, suit.get('name'), case.get('name'), case.get('status')])

worksheet.update(f"A2:E{count}", cases_results)
rule1 = ConditionalFormatRule(
    ranges=[GridRange.from_a1_range(f'D2:D{count}', worksheet)],
    booleanRule=BooleanRule(
        condition=BooleanCondition("TEXT_CONTAINS", ["passed"]),
        format=CellFormat(backgroundColor=Color(0.0, 0.9, 0))
    )
)
rule2 = ConditionalFormatRule(
    ranges=[GridRange.from_a1_range(f'D2:D{count}', worksheet)],
    booleanRule=BooleanRule(
        condition=BooleanCondition("TEXT_CONTAINS", ["failed"]),
        format=CellFormat(backgroundColor=Color(0.8, 0, 0))
    )
)
rule3 = ConditionalFormatRule(
    ranges=[GridRange.from_a1_range(f'D2:D{count}', worksheet)],
    booleanRule=BooleanRule(
        condition=BooleanCondition("TEXT_CONTAINS", ["skipped"]),
        format=CellFormat(backgroundColor=Color(0.9, 0.9, 0))
    )
)
rules = get_conditional_format_rules(worksheet)
rules.append(rule1)
rules.append(rule2)
rules.append(rule3)
rules.save()