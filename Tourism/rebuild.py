import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open('translations.js', 'r', encoding='utf-8') as f:
    translations = f.read()
with open('phrasebook.js', 'r', encoding='utf-8') as f:
    phrasebook = f.read()
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find where the first <script> tag starts
first_script = re.search(r'<script>', html)
if not first_script:
    print("ERROR: No <script> tag found")
    exit(1)

before = html[:first_script.start()]

# Find all <script>...</script> pairs
script_pattern = re.compile(r'<script>(.*?)</script>', re.DOTALL)
script_matches = list(script_pattern.finditer(html))
print(f"Found {len(script_matches)} script blocks: {[len(m.group(1)) for m in script_matches]}")

# Rebuild with fresh components (3 blocks: translations, phrasebook, app)
components = [translations, phrasebook, app_js]
result = before

for i, comp in enumerate(components):
    if i < len(script_matches):
        result += '<script>' + comp + '</script>\n'

# Preserve anything after the last script block
last_end = script_matches[-1].end() if script_matches else len(html)
result += html[last_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print(f"Rebuilt: {len(result)} bytes")
