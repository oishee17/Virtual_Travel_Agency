import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find all lines in CITY_ATTRACTIONS that have unescaped 's patterns
# These are in single-quoted strings like desc: 'Something's value'
# The ' in Something's breaks the string

lines = js.split('\n')
fixed = 0
in_attractions = False

for i, line in enumerate(lines):
    if 'const CITY_ATTRACTIONS' in line:
        in_attractions = True
    if in_attractions and line.strip() == '};':
        in_attractions = False
        continue
    
    if in_attractions and ("desc:" in line or "name:" in line):
        # Find unescaped apostrophes in single-quoted strings
        # Pattern: inside '...', find ' that isn't preceded by \
        # We need to fix patterns like: 'Something's' -> 'Something\\'s'
        new_line = line
        # Find all single-quoted string values
        for match in re.finditer(r"'([^']*'[^']*)'", line):
            val = match.group(1)
            if "'" in val:
                # Has unescaped quote inside
                fixed_val = val.replace("'", "\\'")
                new_line = new_line.replace(match.group(0), "'" + fixed_val + "'", 1)
        
        if new_line != line:
            lines[i] = new_line
            fixed += 1
            print(f'Line {i+1}: {line.strip()[:80]}...')
            print(f'    -> {new_line.strip()[:80]}...')

js = '\n'.join(lines)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print(f'\nFixed {fixed} lines')
