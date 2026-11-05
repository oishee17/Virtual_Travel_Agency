import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the dashboard section
dash_start = html.find('<!-- ============ DASHBOARD SECTION (after login) ============ -->')
dash_end = html.find('</section>', dash_start) + len('</section>')

dashboard_html = html[dash_start:dash_end]

# Remove dashboard from its current position (at the bottom)
html_without_dash = html[:dash_start] + html[dash_end:]

# Find where to insert: right after the edit profile modal closing div
# The edit profile modal ends with </div>\r\n\r\n    <!-- Hero Section -->
insert_marker = '    <!-- Hero Section -->'
insert_pos = html_without_dash.find(insert_marker)

if insert_pos > 0:
    # Insert dashboard before the hero section
    html_reordered = html_without_dash[:insert_pos] + dashboard_html + '\n\n' + html_without_dash[insert_pos:]
else:
    # Fallback: insert after the last </div> of the modal
    modal_end = html_without_dash.find('    </div>\r\n\r\n    <!-- Hero Section -->')
    if modal_end > 0:
        html_reordered = html_without_dash[:modal_end + len('    </div>')] + '\n\n' + dashboard_html + html_without_dash[modal_end + len('    </div>'):]
    else:
        html_reordered = html_without_dash

# Now remove the hero section entirely (dashboard replaces it)
hero_start = html_reordered.find('    <!-- Hero Section -->')
hero_end_marker = '    <!-- Live Map Section -->'
hero_end = html_reordered.find(hero_end_marker)

if hero_start > 0 and hero_end > 0:
    # Remove from hero comment to just before Live Map comment
    html_reordered = html_reordered[:hero_start] + html_reordered[hero_end:]

# Also remove the old dashboard section at the bottom (if it still exists)
# Look for a second occurrence of DASHBOARD SECTION
second_dash = html_reordered.find('<!-- ============ DASHBOARD SECTION (after login) ============ -->', 
                                  html_reordered.find('<!-- ============ DASHBOARD SECTION') + 10)
if second_dash > 0:
    second_dash_end = html_reordered.find('</section>', second_dash) + len('</section>')
    html_reordered = html_reordered[:second_dash] + html_reordered[second_dash_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_reordered)

print(f'Reordered. Dashboard moved to top. Size: {len(html_reordered)} bytes')
