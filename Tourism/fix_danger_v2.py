import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find the dangerZones array
start_marker = 'const dangerZones = ['
start_idx = js.find(start_marker)

# Find the matching closing bracket
bracket_count = 0
end_idx = start_idx
for i in range(start_idx, len(js)):
    if js[i] == '[':
        bracket_count += 1
    elif js[i] == ']':
        bracket_count -= 1
        if bracket_count == 0:
            end_idx = i + 1
            break

zones_text = js[start_idx + len('const dangerZones '):end_idx]

# Parse individual zone objects
zone_objects = []
depth = 0
obj_start = None
for i, ch in enumerate(zones_text):
    if ch == '{' and depth == 0:
        obj_start = i
        depth = 1
    elif ch == '{':
        depth += 1
    elif ch == '}':
        depth -= 1
        if depth == 0 and obj_start is not None:
            zone_objects.append(zones_text[obj_start:i+1])
            obj_start = None

# Extract name from each zone object
def get_name(obj):
    m = re.search(r'name:\s*"([^"]*)"', obj)
    return m.group(1) if m else None

# Names to REMOVE (they were merged into others)
remove_names = {
    "Kashmir LOC Areas",
    "Delhi Summer Heatwave",
    "Himachal Pradesh Hill Zones",
    "Spiti & Kinnaur Remote Zone",
    "Kedarnath & Char Dham Zone",
    "Ladakh Border (Siachen/Kargil)",
    "Gujarat Kutch Rann",
    "Chennai Urban Flooding",
    "Rajasthan Border (Pakistan)",
    "Manipur Valley Insurgency",
    "Nagaland & Arunachal Border",
    "Sikkim & Darjeeling Landslide Zone",
    "Mizoram & Tripura Earthquake Zone",
    "Karnataka Flood Zone",
    # Also remove duplicate merged entries (keep only the new ones)
    "Kashmir Valley",
    "Manali-Leh Highway",
    "Delhi NCR",  # old version, keep new merged version
    "Ladakh Region",  # old version, keep new merged version  
    "Kutch & Gujarat Coast",  # old version
    "Chennai & Coastal Tamil Nadu",  # old version
    "Rajasthan Desert Regions",  # old version
    "Seismic Zone V - Northeast India",
    "Maharashtra Flood & Landslide Zone",  # old version
}

# Keep only non-duplicate merged entries
# After merge, keep these names:
keep_merged = {
    "Kashmir Valley & LOC",
    "Himachal Pradesh (Manali, Spiti, Kinnaur)",
    "Northeast India (Manipur, Nagaland, Arunachal)",
    "Chennai & Coastal Tamil Nadu",  # merged version
    "Uttarakhand Himalayas & Kedarnath",
    "Delhi NCR",  # merged version
    "Rajasthan Desert & Border",
    "Ladakh Region & Siachen",
    "Kutch & Gujarat Coast",  # merged version
    "Sikkim, Darjeeling, Mizoram & Tripura",
    "Maharashtra & Karnataka Flood Zone",  # merged version
}

# Filter: keep zones NOT in remove list, but handle "Delhi NCR" etc carefully
# First pass: identify which zones to keep
final_zones = []
seen_names = set()
for obj in zone_objects:
    name = get_name(obj)
    if name in remove_names:
        continue
    # Handle duplicate names - keep only the merged (longer-named) version
    if name in seen_names:
        # Already have this name - skip if it's the old version
        continue
    seen_names.add(name)
    final_zones.append(obj)

print(f"Zones before: {len(zone_objects)}")
print(f"Zones after: {len(final_zones)}")

# Rebuild the array
new_zones_text = "[\n" + ",\n".join(final_zones) + "\n]"
new_js = js[:start_idx] + "const dangerZones = " + new_zones_text + js[end_idx:]

# Also update the highlights to match new merged names
new_js = new_js.replace(
    "dangerZones.find(z => z.name.includes('Kashmir'))",
    "dangerZones.find(z => z.name.includes('Kashmir Valley'))"
)
new_js = new_js.replace(
    "dangerZones.find(z => z.name.includes('Manali'))",
    "dangerZones.find(z => z.name.includes('Himachal'))"
)
new_js = new_js.replace(
    "dangerZones.find(z => z.name.includes('Chennai') || z.name.includes('Sundarbans'))",
    "dangerZones.find(z => z.name.includes('Chennai'))"
)

# Reduce all radii by 30%
def reduce_radius(match):
    val = int(match.group(1))
    new_val = max(15000, int(val * 0.65))
    return f"radius: {new_val}"

new_js = re.sub(r'radius:\s*(\d+)', reduce_radius, new_js)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_js)

# Verify
names_final = re.findall(r'name: "([^"]*)"', new_js[start_idx:])
print("\nFinal zones:")
for i, n in enumerate(names_final):
    print(f"  {i+1}. {n}")
