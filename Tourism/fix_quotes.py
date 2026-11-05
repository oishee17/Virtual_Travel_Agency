import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix specific problematic strings with unescaped single quotes
# These are inside single-quoted JS strings
fixes = [
    ("One of India's tallest.", "One of India\\'s tallest."),
    ("One of Asia's tallest.", "One of Asia\\'s tallest."),
    ("India's largest mosque.", "India\\'s largest mosque."),
    ("India's first science museum.", "India\\'s first science museum."),
    ("India's largest cricket stadium.", "India\\'s largest cricket stadium."),
    ("Buddha's first sermon site.", "Buddha\\'s first sermon site."),
    ("Dil Chahta Hai fort.", "Dil Chahta Hai fort."),
    ("St. Francis Xavier remains.", "St. Francis Xavier remains."),
    ("St. Francis Xavier.", "St. Francis Xavier."),
    ("One of India's tallest.", "One of India\\'s tallest."),
    ("Queen of beaches.", "Queen of beaches."),
    ("One of India's tallest.", "One of India\\'s tallest."),
    ("Buddha's first sermon.", "Buddha\\'s first sermon."),
    ("Buddha's first sermon site", "Buddha\\'s first sermon site"),
    ("world's highest motorable", "world\\'s highest motorable"),
    ("World's largest film", "World\\'s largest film"),
    ("World's longest cantilever", "World\\'s longest cantilever"),
    ("world's longest cantilever", "world\\'s longest cantilever"),
    ("Asia's largest residential", "Asia\\'s largest residential"),
    ("Ramakrishna meditated", "Ramakrishna meditated"),
    ("Luv and Kush's", "Luv and Kush\\'s"),
    ("Queen's Necklace", "Queen\\'s Necklace"),
    ("Beatles meditated", "Beatles meditated"),
    ("Ramakrishna's", "Ramakrishna\\'s"),
]

for old, new in fixes:
    count = js.count(old)
    if count > 0:
        js = js.replace(old, new)
        print(f'Fixed {count}x: {old[:40]}...')

# Also find any remaining unescaped single quotes inside single-quoted strings
# Pattern: inside a string delimited by single quotes, find unescaped single quotes
# Look for lines with desc: '...' that have unescaped '
lines = js.split('\n')
fixed_count = 0
for i, line in enumerate(lines):
    if "'desc':" in line or "desc: '" in line:
        # Find the desc value
        match = re.search(r"desc: '((?:[^'\\]|\\.)*)'([^']*'[^']*'[^']*)", line)
        if match and "'" in line[match.end():match.end()+100]:
            # There's a broken quote
            pass

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f'\nDone. File size: {len(js)} bytes')
