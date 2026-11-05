#!/usr/bin/env python3
"""
Bharat Suraksha — Smart India Hackathon 2026 Presentation Generator
6-slide professional PPT with custom styling
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import os

# ── Color Palette ──
DARK_BG      = RGBColor(0x0F, 0x17, 0x2A)  # Deep navy
ACCENT_BLUE  = RGBColor(0x00, 0x96, 0xD6)  # Bright blue
ACCENT_GREEN = RGBColor(0x00, 0xC9, 0xA7)  # Teal green
ACCENT_RED   = RGBColor(0xFF, 0x45, 0x57)  # Alert red
ACCENT_GOLD  = RGBColor(0xFF, 0xB8, 0x00)  # Gold
WHITE        = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GRAY   = RGBColor(0xB0, 0xBC, 0xD4)
MID_GRAY     = RGBColor(0x6C, 0x75, 0x8E)
CARD_BG      = RGBColor(0x1A, 0x25, 0x3C)  # Slightly lighter card
SIH_ORANGE   = RGBColor(0xFF, 0x6B, 0x00)  # SIH brand orange

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
W = prs.slide_width
H = prs.slide_height


# ── Helper functions ──

def add_bg(slide, color=DARK_BG):
    """Fill slide background with solid color."""
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_shape(slide, left, top, width, height, fill_color=None, line_color=None, line_width=None, shape_type=MSO_SHAPE.RECTANGLE):
    """Add a rectangle shape."""
    shape = slide.shapes.add_shape(shape_type, left, top, width, height)
    shape.line.fill.background()
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    else:
        shape.fill.background()
    if line_color:
        shape.line.fill.solid()
        shape.line.color.rgb = line_color
        shape.line.width = line_width or Pt(1)
    return shape


def add_text(slide, left, top, width, height, text, font_size=18, color=WHITE,
             bold=False, alignment=PP_ALIGN.LEFT, font_name="Calibri", line_spacing=1.2):
    """Add a text box with styled text."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    p.space_after = Pt(0)
    p.line_spacing = Pt(font_size * line_spacing)
    return txBox


def add_multiline(slide, left, top, width, height, lines, font_size=16, color=WHITE, 
                  alignment=PP_ALIGN.LEFT, font_name="Calibri", line_spacing=1.3):
    """Add a text box with multiple lines/paragraphs."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line_data in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        
        if isinstance(line_data, dict):
            p.text = line_data.get("text", "")
            p.font.size = Pt(line_data.get("size", font_size))
            p.font.color.rgb = line_data.get("color", color)
            p.font.bold = line_data.get("bold", False)
            p.font.name = line_data.get("font", font_name)
            p.alignment = line_data.get("align", alignment)
            p.space_after = Pt(line_data.get("space_after", 4))
            p.line_spacing = Pt(line_data.get("size", font_size) * line_spacing)
        else:
            p.text = line_data
            p.font.size = Pt(font_size)
            p.font.color.rgb = color
            p.font.name = font_name
            p.alignment = alignment
            p.space_after = Pt(4)
            p.line_spacing = Pt(font_size * line_spacing)
    return txBox


def add_card(slide, left, top, width, height, title, bullets, icon="",
             title_color=ACCENT_BLUE, bg_color=CARD_BG, bullet_size=14):
    """Add a styled card with title and bullet points."""
    # Card background
    card = add_shape(slide, left, top, width, height, fill_color=bg_color)
    card.shadow.inherit = False
    
    # Accent top line
    add_shape(slide, left, top, width, Pt(3), fill_color=title_color)
    
    # Icon + Title
    title_text = f"{icon}  {title}" if icon else title
    add_text(slide, left + Inches(0.2), top + Inches(0.12), width - Inches(0.4), Inches(0.4),
             title_text, font_size=16, color=title_color, bold=True)
    
    # Bullets
    lines = []
    for b in bullets:
        lines.append({"text": f"  {b}", "size": bullet_size, "color": LIGHT_GRAY, "space_after": 3})
    add_multiline(slide, left + Inches(0.15), top + Inches(0.55), width - Inches(0.3), 
                  height - Inches(0.65), lines)


def add_accent_bar(slide, left, top, width, color=ACCENT_BLUE):
    """Add a thin accent bar."""
    add_shape(slide, left, top, width, Pt(4), fill_color=color)


def add_badge(slide, left, top, text, color=ACCENT_BLUE, font_size=11):
    """Add a small rounded badge."""
    badge = add_shape(slide, left, top, Inches(1.8), Inches(0.32), fill_color=color)
    badge.text_frame.paragraphs[0].text = text
    badge.text_frame.paragraphs[0].font.size = Pt(font_size)
    badge.text_frame.paragraphs[0].font.color.rgb = WHITE
    badge.text_frame.paragraphs[0].font.bold = True
    badge.text_frame.paragraphs[0].font.name = "Calibri"
    badge.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    badge.text_frame.paragraphs[0].space_before = Pt(0)
    badge.text_frame.paragraphs[0].space_after = Pt(0)
    return badge


# ══════════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE SLIDE
# ══════════════════════════════════════════════════════════════════

slide1 = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
add_bg(slide1)

# Decorative gradient bar at top
add_shape(slide1, Inches(0), Inches(0), W, Inches(0.08), fill_color=ACCENT_BLUE)

# SIH 2026 Badge
add_badge(slide1, Inches(0.8), Inches(0.5), "SMART INDIA HACKATHON 2026", SIH_ORANGE, 13)

# Project name
add_text(slide1, Inches(0.8), Inches(1.4), Inches(11), Inches(1.2),
         "BHARAT SURAKSHA", font_size=56, color=WHITE, bold=True)
add_text(slide1, Inches(0.8), Inches(2.5), Inches(11), Inches(0.8),
         "Smart Tourist Safety & Navigation Portal for India", 
         font_size=28, color=ACCENT_BLUE, bold=False)

# Accent line under subtitle
add_accent_bar(slide1, Inches(0.8), Inches(3.3), Inches(4), ACCENT_GREEN)

# Tagline
add_text(slide1, Inches(0.8), Inches(3.6), Inches(8), Inches(0.6),
         "\"Breaking Language Barriers · Ensuring Safety · Enriching Travel\"",
         font_size=18, color=LIGHT_GRAY)

# Feature highlights in cards
features_row = [
    ("🌐", "22+ Languages", ACCENT_BLUE),
    ("🗺️", "Live Tracking", ACCENT_GREEN),
    ("🚨", "Emergency SOS", ACCENT_RED),
    ("⚠️", "Danger Zones", ACCENT_GOLD),
]

x_start = Inches(0.8)
for i, (icon, label, color) in enumerate(features_row):
    x = x_start + Inches(i * 2.8)
    card = add_shape(slide1, x, Inches(4.5), Inches(2.5), Inches(1.0), fill_color=CARD_BG)
    add_shape(slide1, x, Inches(4.5), Inches(2.5), Pt(3), fill_color=color)
    add_text(slide1, x, Inches(4.6), Inches(2.5), Inches(0.45),
             icon, font_size=26, color=WHITE, alignment=PP_ALIGN.CENTER)
    add_text(slide1, x, Inches(5.05), Inches(2.5), Inches(0.4),
             label, font_size=15, color=LIGHT_GRAY, alignment=PP_ALIGN.CENTER, bold=True)

# Bottom info bar
add_shape(slide1, Inches(0), Inches(6.7), W, Inches(0.8), fill_color=CARD_BG)
add_text(slide1, Inches(0.8), Inches(6.85), Inches(6), Inches(0.5),
         "Team Name  |  Problem Statement ID: _______  |  Category: Software",
         font_size=13, color=MID_GRAY)
add_text(slide1, Inches(8), Inches(6.85), Inches(4.5), Inches(0.5),
         "Tech Stack: HTML5 · CSS3 · JavaScript · Google Maps API",
         font_size=13, color=MID_GRAY, alignment=PP_ALIGN.RIGHT)


# ══════════════════════════════════════════════════════════════════
# SLIDE 2 — PROBLEM STATEMENT
# ══════════════════════════════════════════════════════════════════

slide2 = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide2)
add_shape(slide2, Inches(0), Inches(0), W, Inches(0.08), fill_color=ACCENT_RED)

add_badge(slide2, Inches(0.8), Inches(0.5), "SLIDE 02 / 06", ACCENT_RED, 11)
add_text(slide2, Inches(0.8), Inches(1.0), Inches(10), Inches(0.7),
         "THE PROBLEM", font_size=42, color=WHITE, bold=True)
add_text(slide2, Inches(0.8), Inches(1.7), Inches(10), Inches(0.5),
         "Why Tourists in India Face Unnecessary Risks", font_size=20, color=LIGHT_GRAY)
add_accent_bar(slide2, Inches(0.8), Inches(2.25), Inches(3), ACCENT_RED)

# Key statistics row
stats = [
    ("10.9M", "Foreign tourists\nvisited India in 2024", ACCENT_BLUE),
    ("2.5B+", "Domestic tourist\nvisits annually", ACCENT_GREEN),
    ("30%", "Face language\nbarrier issues", ACCENT_GOLD),
    ("45%", "Lack emergency\ninfo access", ACCENT_RED),
]

for i, (num, desc, color) in enumerate(stats):
    x = Inches(0.8) + Inches(i * 3.1)
    add_shape(slide2, x, Inches(2.6), Inches(2.8), Inches(1.3), fill_color=CARD_BG)
    add_shape(slide2, x, Inches(2.6), Pt(4), Inches(1.3), fill_color=color)
    add_text(slide2, x + Inches(0.2), Inches(2.7), Inches(2.4), Inches(0.6),
             num, font_size=32, color=color, bold=True)
    add_text(slide2, x + Inches(0.2), Inches(3.25), Inches(2.4), Inches(0.55),
             desc, font_size=12, color=LIGHT_GRAY)

# Problem cards
problems = [
    ("🗣️", "Language Barrier", [
        "India has 22 official languages + 100s of dialects",
        "Foreign & domestic tourists cannot communicate",
        "Critical info unavailable in local languages",
        "No unified translation tool for travelers"
    ], ACCENT_BLUE),
    ("🆘", "Safety & Emergencies", [
        "No quick access to police/ambulance numbers",
        "Tourists unaware of danger zones & risks",
        "Personal safety info scattered across sources",
        "No real-time location tracking for emergencies"
    ], ACCENT_RED),
    ("📍", "Navigation & Info", [
        "Difficulty finding nearby hospitals, police",
        "Unaware of accessibility options (disabled)",
        "No crowd-level info at popular attractions",
        "Weather disruptions unpredicted for travelers"
    ], ACCENT_GREEN),
]

for i, (icon, title, bullets, color) in enumerate(problems):
    x = Inches(0.8) + Inches(i * 4.05)
    add_card(slide2, x, Inches(4.15), Inches(3.8), Inches(3.0),
             title, bullets, icon, title_color=color, bullet_size=12)


# ══════════════════════════════════════════════════════════════════
# SLIDE 3 — PROPOSED SOLUTION
# ══════════════════════════════════════════════════════════════════

slide3 = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide3)
add_shape(slide3, Inches(0), Inches(0), W, Inches(0.08), fill_color=ACCENT_GREEN)

add_badge(slide3, Inches(0.8), Inches(0.5), "SLIDE 03 / 06", ACCENT_GREEN, 11)
add_text(slide3, Inches(0.8), Inches(1.0), Inches(10), Inches(0.7),
         "OUR SOLUTION", font_size=42, color=WHITE, bold=True)
add_text(slide3, Inches(0.8), Inches(1.7), Inches(10), Inches(0.5),
         "Bharat Suraksha — All-in-One Tourist Safety Platform", font_size=20, color=LIGHT_GRAY)
add_accent_bar(slide3, Inches(0.8), Inches(2.25), Inches(3), ACCENT_GREEN)

# 2x3 feature grid
solution_cards = [
    ("🌐", "22+ Language Translator", [
        "Offline phrasebook with 45+ essential phrases",
        "Online API fallback (MyMemory + Google)",
        "Quick-tap tourist phrase categories",
        "Works in Hindi, Bengali, Tamil, Telugu, etc."
    ], ACCENT_BLUE),
    ("🗺️", "Interactive Safety Map", [
        "Live Google Maps with real-time tracking",
        "Real-time GPS location tracking",
        "Nearby hospitals, police, hotels, restaurants",
        "Color-coded markers for instant recognition"
    ], ACCENT_GREEN),
    ("🚨", "SOS Emergency System", [
        "One-tap SOS button → calls police (100)",
        "Auto-shares GPS location with contacts",
        "8 national emergency numbers built-in",
        "Personal emergency contact management"
    ], ACCENT_RED),
    ("⚠️", "Danger Zone Alerts", [
        "12 mapped danger zones across India",
        "Kashmir — terrorism, Manali — landslide",
        "Earthquake, flood, cyclone prone areas",
        "Risk-level badges & safety advisories"
    ], ACCENT_GOLD),
    ("🌤️", "Weather Warnings", [
        "Monsoon, cyclone, landslide predictions",
        "Heat wave & air quality alerts",
        "Destination-specific advisories",
        "Trip disruption risk scoring"
    ], RGBColor(0x7B, 0x68, 0xEE)),
    ("♿", "Accessibility & Crowd Info", [
        "8-category accessibility ratings",
        "Tips for wheelchair / visually impaired",
        "Overcrowding % at popular tourist spots",
        "Best visit times & alternatives suggested"
    ], RGBColor(0xFF, 0x69, 0xB4)),
]

for i, (icon, title, bullets, color) in enumerate(solution_cards):
    col = i % 3
    row = i // 3
    x = Inches(0.6) + Inches(col * 4.15)
    y = Inches(2.55) + Inches(row * 2.45)
    add_card(slide3, x, y, Inches(3.95), Inches(2.25),
             title, bullets, icon, title_color=color, bullet_size=12)


# ══════════════════════════════════════════════════════════════════
# SLIDE 4 — TECHNICAL ARCHITECTURE
# ══════════════════════════════════════════════════════════════════

slide4 = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide4)
add_shape(slide4, Inches(0), Inches(0), W, Inches(0.08), fill_color=ACCENT_BLUE)

add_badge(slide4, Inches(0.8), Inches(0.5), "SLIDE 04 / 06", ACCENT_BLUE, 11)
add_text(slide4, Inches(0.8), Inches(1.0), Inches(10), Inches(0.7),
         "TECHNICAL ARCHITECTURE", font_size=42, color=WHITE, bold=True)
add_text(slide4, Inches(0.8), Inches(1.7), Inches(10), Inches(0.5),
         "How Bharat Suraksha Works — System Design & Tech Stack", font_size=20, color=LIGHT_GRAY)
add_accent_bar(slide4, Inches(0.8), Inches(2.25), Inches(3), ACCENT_BLUE)

# Tech stack cards (left side)
add_card(slide4, Inches(0.6), Inches(2.6), Inches(3.8), Inches(2.2),
         "Frontend Stack", [
             "HTML5 — Semantic structure & accessibility",
             "CSS3 — Dark theme, responsive design",
             "JavaScript (ES6+) — All app logic",
             "Google Maps API — Interactive maps",
             "Font Awesome — Icon library",
         ], "⚙️", title_color=ACCENT_BLUE, bullet_size=12)

add_card(slide4, Inches(0.6), Inches(5.0), Inches(3.8), Inches(2.2),
         "External APIs & Services", [
             "Google Directions API — Route planning",
             "MyMemory API — Free translation service",
             "Google Translate — Fallback translation",
             "Browser Geolocation API — GPS tracking",
             "localStorage — Offline data persistence",
         ], "🔌", title_color=ACCENT_GREEN, bullet_size=12)

# Architecture diagram (right side - flow chart)
add_text(slide4, Inches(5.2), Inches(2.6), Inches(7), Inches(0.4),
         "SYSTEM ARCHITECTURE", font_size=18, color=ACCENT_BLUE, bold=True)

# Flow boxes
flow_steps = [
    ("👤 User Registration", "Name, Password, Nationality,\nDestination, Budget, Language", ACCENT_BLUE),
    ("📊 Profile Dashboard", "Weather Alerts, Crowd Levels,\nAccessibility Info, Route Map", ACCENT_GREEN),
    ("🗺️ Map Module", "Live Tracking, Nearby Places,\nDanger Zones, Route Planning", ACCENT_GOLD),
    ("🌐 Translator Module", "Offline Phrasebook (45+ phrases),\nOnline API Fallback", RGBColor(0x7B, 0x68, 0xEE)),
    ("🚨 Emergency Module", "SOS Button, Emergency Contacts,\nLocation Sharing", ACCENT_RED),
]

for i, (title, desc, color) in enumerate(flow_steps):
    y = Inches(3.05) + Inches(i * 0.85)
    box = add_shape(slide4, Inches(5.2), y, Inches(7.2), Inches(0.75), fill_color=CARD_BG)
    add_shape(slide4, Inches(5.2), y, Pt(4), Inches(0.75), fill_color=color)
    add_text(slide4, Inches(5.45), y + Inches(0.05), Inches(3), Inches(0.35),
             title, font_size=14, color=color, bold=True)
    add_text(slide4, Inches(5.45), y + Inches(0.35), Inches(6.5), Inches(0.35),
             desc, font_size=11, color=LIGHT_GRAY)

    # Arrow between boxes
    if i < len(flow_steps) - 1:
        add_text(slide4, Inches(8.5), y + Inches(0.72), Inches(0.5), Inches(0.2),
                 "↓", font_size=14, color=MID_GRAY, alignment=PP_ALIGN.CENTER)

# Key metrics box
add_shape(slide4, Inches(5.2), Inches(7.0) - Inches(0.85), Inches(7.2), Inches(0.65), fill_color=CARD_BG)
add_text(slide4, Inches(5.4), Inches(7.0) - Inches(0.8), Inches(6.8), Inches(0.55),
         "📦 Single HTML file (~205KB) · Zero server dependency · Works offline · Mobile responsive",
         font_size=13, color=ACCENT_GREEN, bold=True, alignment=PP_ALIGN.CENTER)


# ══════════════════════════════════════════════════════════════════
# SLIDE 5 — BENEFITS & IMPACT
# ══════════════════════════════════════════════════════════════════

slide5 = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide5)
add_shape(slide5, Inches(0), Inches(0), W, Inches(0.08), fill_color=ACCENT_GOLD)

add_badge(slide5, Inches(0.8), Inches(0.5), "SLIDE 05 / 06", ACCENT_GOLD, 11)
add_text(slide5, Inches(0.8), Inches(1.0), Inches(10), Inches(0.7),
         "BENEFITS & IMPACT", font_size=42, color=WHITE, bold=True)
add_text(slide5, Inches(0.8), Inches(1.7), Inches(10), Inches(0.5),
         "How Bharat Suraksha Transforms Tourism Safety in India", font_size=20, color=LIGHT_GRAY)
add_accent_bar(slide5, Inches(0.8), Inches(2.25), Inches(3), ACCENT_GOLD)

# Impact metrics
impact_stats = [
    ("100%", "Language Coverage", "All 22 official\nIndian languages", ACCENT_BLUE),
    ("< 2s", "Response Time", "Offline translation\ninstant results", ACCENT_GREEN),
    ("0", "Server Cost", "Fully client-side\nno backend needed", ACCENT_GOLD),
    ("24/7", "Availability", "Works offline\nno internet needed", ACCENT_RED),
]

for i, (num, label, desc, color) in enumerate(impact_stats):
    x = Inches(0.6) + Inches(i * 3.15)
    add_shape(slide5, x, Inches(2.55), Inches(2.9), Inches(1.4), fill_color=CARD_BG)
    add_text(slide5, x, Inches(2.6), Inches(2.9), Inches(0.6),
             num, font_size=36, color=color, bold=True, alignment=PP_ALIGN.CENTER)
    add_text(slide5, x, Inches(3.15), Inches(2.9), Inches(0.3),
             label, font_size=14, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_text(slide5, x, Inches(3.5), Inches(2.9), Inches(0.4),
             desc, font_size=11, color=LIGHT_GRAY, alignment=PP_ALIGN.CENTER)

# Benefits grid
benefit_groups = [
    ("For Tourists", "🧑", [
        "Eliminates language barriers in real-time",
        "Instant access to emergency services",
        "Know danger zones before visiting",
        "Find hospitals, police, hotels easily",
        "Real-time weather warnings for trips",
        "Accessibility info for disabled travelers",
    ], ACCENT_BLUE),
    ("For Tourism Industry", "🏢", [
        "Increases tourist confidence & safety",
        "Reduces government emergency response",
        "Promotes lesser-known safe destinations",
        "Improves India's tourism image globally",
        "Data insights for crowd management",
        "Boosts domestic & foreign tourism GDP",
    ], ACCENT_GREEN),
    ("For Government / SIH", "🏛️", [
        "Directly addresses Ministry of Tourism goals",
        "Low-cost, scalable solution (zero servers)",
        "Open data potential for policy making",
        "Enhances Digital India initiative",
        "Supports Incredible India campaign",
        "Measurable safety improvement metrics",
    ], ACCENT_GOLD),
]

for i, (title, icon, bullets, color) in enumerate(benefit_groups):
    x = Inches(0.6) + Inches(i * 4.15)
    add_card(slide5, x, Inches(4.2), Inches(3.95), Inches(3.1),
             title, bullets, icon, title_color=color, bullet_size=12)


# ══════════════════════════════════════════════════════════════════
# SLIDE 6 — FUTURE SCOPE & CONCLUSION
# ══════════════════════════════════════════════════════════════════

slide6 = prs.slides.add_slide(prs.slide_layouts[6])
add_bg(slide6)
add_shape(slide6, Inches(0), Inches(0), W, Inches(0.08), fill_color=SIH_ORANGE)

add_badge(slide6, Inches(0.8), Inches(0.5), "SLIDE 06 / 06", SIH_ORANGE, 11)
add_text(slide6, Inches(0.8), Inches(1.0), Inches(10), Inches(0.7),
         "FUTURE SCOPE & ROADMAP", font_size=42, color=WHITE, bold=True)
add_text(slide6, Inches(0.8), Inches(1.7), Inches(10), Inches(0.5),
         "Scaling Bharat Suraksha — From Prototype to National Platform", font_size=20, color=LIGHT_GRAY)
add_accent_bar(slide6, Inches(0.8), Inches(2.25), Inches(3), SIH_ORANGE)

# Roadmap timeline
phases = [
    ("Phase 1", "NOW (SIH 2026)", [
        "Complete prototype with all core features",
        "Offline phrasebook in 22 languages",
        "Interactive map with danger zones",
        "SOS emergency system",
    ], ACCENT_GREEN, "✅"),
    ("Phase 2", "6 MONTHS", [
        "Native Android & iOS apps",
        "Backend with user analytics",
        "Real-time weather API integration",
        "Government tourism data partnership",
    ], ACCENT_BLUE, "🔧"),
    ("Phase 3", "12 MONTHS", [
        "AI-powered route recommendations",
        "Crowd prediction using ML models",
        "Multi-country language expansion",
        "IoT wearable integration",
    ], ACCENT_GOLD, "🚀"),
    ("Phase 4", "24 MONTHS", [
        "Pan-India government deployment",
        "Integration with Indian Railways / IRCTC",
        "AR-based on-ground navigation",
        "International tourist onboarding portal",
    ], RGBColor(0x7B, 0x68, 0xEE), "🌍"),
]

for i, (phase, timeline, bullets, color, icon) in enumerate(phases):
    x = Inches(0.5) + Inches(i * 3.15)
    add_shape(slide6, x, Inches(2.55), Inches(2.95), Inches(0.5), fill_color=color)
    add_text(slide6, x + Inches(0.1), Inches(2.58), Inches(2.75), Inches(0.45),
             f"{icon}  {phase}", font_size=15, color=WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    add_text(slide6, x, Inches(3.1), Inches(2.95), Inches(0.35),
             timeline, font_size=13, color=color, bold=True, alignment=PP_ALIGN.CENTER)
    bullet_lines = []
    for b in bullets:
        bullet_lines.append({"text": f"  {b}", "size": 11, "color": LIGHT_GRAY, "space_after": 2})
    add_multiline(slide6, x + Inches(0.05), Inches(3.45), Inches(2.85), Inches(1.5), bullet_lines)

    # Connecting arrow
    if i < len(phases) - 1:
        add_text(slide6, x + Inches(2.9), Inches(2.65), Inches(0.3), Inches(0.4),
                 "→", font_size=18, color=MID_GRAY, alignment=PP_ALIGN.CENTER)

# Conclusion box
add_shape(slide6, Inches(0.6), Inches(5.2), Inches(12.1), Inches(1.2), fill_color=CARD_BG)
add_shape(slide6, Inches(0.6), Inches(5.2), Inches(12.1), Pt(3), fill_color=SIH_ORANGE)
add_text(slide6, Inches(1.0), Inches(5.35), Inches(11.3), Inches(0.4),
         "💡 CONCLUSION", font_size=18, color=SIH_ORANGE, bold=True)
add_text(slide6, Inches(1.0), Inches(5.7), Inches(11.3), Inches(0.65),
         "Bharat Suraksha is a zero-cost, fully offline, multilingual tourist safety platform that "
         "addresses India's biggest tourism pain points — language barriers, emergency access, danger awareness, "
         "and accessibility. Built as a single portable HTML file, it can be deployed instantly across "
         "government tourism portals, hotel chains, and travel agencies with zero infrastructure cost.",
         font_size=14, color=LIGHT_GRAY)

# Thank you footer
add_shape(slide6, Inches(0), Inches(6.7), W, Inches(0.8), fill_color=CARD_BG)
add_text(slide6, Inches(0.8), Inches(6.8), Inches(5), Inches(0.5),
         "🙏  THANK YOU  —  SIH 2026", font_size=22, color=WHITE, bold=True)
add_text(slide6, Inches(7), Inches(6.85), Inches(5.5), Inches(0.5),
         "Bharat Suraksha  |  Smart Tourist Safety  |  Digital India",
         font_size=14, color=MID_GRAY, alignment=PP_ALIGN.RIGHT)


# ══════════════════════════════════════════════════════════════════
# SAVE
# ══════════════════════════════════════════════════════════════════

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "BharatSuraksha_SIH2026.pptx")
prs.save(output_path)
print(f"Presentation saved to: {output_path}")
print(f"   Slides: {len(prs.slides)}")
print(f"   Size: {os.path.getsize(output_path) / 1024:.1f} KB")
