import argparse
parser = argparse.ArgumentParser()


LIST_OF_ARGS = ['browser', 'TAGS',  'TESTRAIL_URL', 'SUIT_ID']
for ar in LIST_OF_ARGS:
    if ar == 'TAGS':
        parser.add_argument('--' + ar, nargs='?')
    else:
        parser.add_argument('--'+ar)
args = parser.parse_args().__dict__
print(args.keys())
print(args)
text = ''
for key in args.keys():
    text += key + '=' + str(args.get(key)) + '\n'


with open('allure-results/environment.properties', 'w') as doc:
        doc.write(text)