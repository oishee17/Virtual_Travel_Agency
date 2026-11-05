#!/usr/bin/env python3
"""Add comprehensive responsive CSS"""

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove existing media queries that we'll replace with comprehensive ones
import re

# Find and remove all existing @media blocks from styles.css
# We'll append our comprehensive responsive CSS at the end

responsive_css = """

/* ═══════════════════════════════════════════════════════════
   COMPREHENSIVE RESPONSIVE CSS — Bharat Suraksha
   Breakpoints: 1200px, 992px, 768px, 576px, 480px, 360px
   ═══════════════════════════════════════════════════════════ */

/* ── TABLET LANDSCAPE (≤ 1200px) ── */
@media (max-width: 1200px) {
    .dashboard-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .danger-summary-grid { grid-template-columns: repeat(2, 1fr); }
    .route-info { flex-wrap: wrap; }
    .attraction-grid { gap: 8px; }
}

/* ── TABLET PORTRAIT (≤ 992px) ── */
@media (max-width: 992px) {
    .dashboard-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .emergency-grid { grid-template-columns: 1fr 1fr; }
    .danger-zones-grid { grid-template-columns: 1fr 1fr; }
    .danger-summary-grid { grid-template-columns: repeat(2, 1fr); }
    .accessibility-grid { grid-template-columns: 1fr 1fr; }
    .attraction-grid { grid-template-columns: 1fr 1fr; }
    .route-info { gap: 10px; }
    .travel-mode-selector { flex-wrap: wrap; justify-content: center; }
    .translator-container { flex-direction: column; }
    .translator-swap { justify-content: center; }
    #language-selector { right: 10px; }
}

/* ── MOBILE LANDSCAPE / SMALL TABLET (≤ 768px) ── */
@media (max-width: 768px) {
    /* Navigation */
    .hamburger { display: block; }
    .nav-links {
        display: none;
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.98);
        flex-direction: column;
        padding: 20px;
        border-bottom: 1px solid var(--border);
        z-index: 999;
        overflow-y: auto;
    }
    .nav-links.open { display: flex; }
    .nav-links a { padding: 14px 0; font-size: 1rem; border-bottom: 1px solid var(--border); }
    .nav-brand span { font-size: 1rem; }

    /* Language selector */
    #language-selector {
        position: fixed;
        top: auto;
        bottom: 120px;
        right: 15px;
        z-index: 998;
    }
    #lang-select { max-width: 140px; font-size: 0.8rem; padding: 6px 8px; }

    /* Sections */
    .section { padding: 40px 16px; }
    .section-header h2 { font-size: 1.5rem; }
    .section-header p { font-size: 0.9rem; }

    /* Hero */
    .hero-content h1 { font-size: 2rem; }
    .hero-content p { font-size: 0.95rem; }

    /* Dashboard */
    .dashboard-grid { grid-template-columns: 1fr; gap: 16px; }
    .dash-card { padding: 18px; }

    /* Welcome banner */
    .welcome-banner { flex-direction: column; text-align: center; gap: 12px; }
    .welcome-actions { justify-content: center; }

    /* Profile */
    .profile-grid { grid-template-columns: 1fr 1fr; }

    /* Weather/Crowd/Accessibility */
    .weather-alerts-list { max-height: 250px; }
    .crowd-grid { grid-template-columns: 1fr; }
    .accessibility-grid { grid-template-columns: 1fr; }

    /* Emergency */
    .emergency-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .emergency-card { padding: 16px; }
    .emergency-card .emergency-number { font-size: 1.3rem; }

    /* Danger zones */
    .danger-zones-grid { grid-template-columns: 1fr; }
    .danger-summary-grid { grid-template-columns: 1fr; }
    .danger-card { padding: 16px; }

    /* Route */
    .travel-mode-selector { gap: 6px; padding: 8px; }
    .travel-mode-btn { padding: 8px 12px; font-size: 0.8rem; }
    #map-container { height: 350px; }
    .route-map-container { height: 300px; }
    .map-controls { flex-direction: column; gap: 10px; }
    .map-controls .btn { width: 100%; justify-content: center; }
    .route-info { flex-direction: column; gap: 8px; }
    .route-info .route-stat { font-size: 0.85rem; }

    /* Attractions */
    .attraction-grid { grid-template-columns: 1fr; }
    .attraction-chip { flex: 1 1 100%; }

    /* Translator */
    .translator-container { flex-direction: column; }
    .translator-swap { justify-content: center; padding: 10px 0; }
    .translator-input-group { min-height: 100px; }

    /* Quick phrases */
    .phrase-categories { flex-wrap: wrap; gap: 6px; }
    .phrase-cat-btn { padding: 6px 12px; font-size: 0.8rem; }

    /* Tracking panel */
    .tracking-grid { grid-template-columns: repeat(2, 1fr); }
    .tracking-panel-header { padding: 10px 12px; }

    /* POI bars */
    .live-poi-bar, .route-poi-bar { gap: 6px; padding: 8px 10px; }
    .live-poi-toggle, .route-poi-toggle { padding: 4px 8px; font-size: 0.72rem; }

    /* Footer */
    .footer-content { grid-template-columns: 1fr; gap: 24px; text-align: center; }

    /* Notification panel */
    .notif-panel {
        width: calc(100vw - 30px);
        right: -10px;
        max-height: 60vh;
    }

    /* Chatbot */
    .chatbot-panel {
        width: calc(100vw - 20px);
        right: 10px;
        left: 10px;
        bottom: 80px;
        max-height: 60vh;
    }
    .chatbot-fab { bottom: 100px; right: 15px; }

    /* SOS button */
    .sos-float { bottom: 160px; right: 15px; width: 56px; height: 56px; font-size: 0.9rem; }

    /* Login/Register */
    .login-card { padding: 24px 20px; margin: 10px; }
    .login-card h1 { font-size: 1.5rem; }
    .form-row { grid-template-columns: 1fr !important; }

    /* Modal */
    .modal-content { width: 95%; max-height: 90vh; }
    .modal-body .form-row { grid-template-columns: 1fr !important; }

    /* Danger alert overlay */
    .danger-alert-content { margin: 10px; padding: 20px; max-width: 95vw; }
}

/* ── MOBILE PORTRAIT (≤ 576px) ── */
@media (max-width: 576px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .emergency-grid { grid-template-columns: 1fr; }
    .danger-zones-grid { grid-template-columns: 1fr; }
    .danger-summary-grid { grid-template-columns: 1fr; }
    .profile-grid { grid-template-columns: 1fr; }
    .crowd-grid { grid-template-columns: 1fr; }
    .accessibility-grid { grid-template-columns: 1fr; }
    .attraction-grid { grid-template-columns: 1fr; }

    .section { padding: 30px 12px; }
    .section-header h2 { font-size: 1.3rem; }
    .hero-content h1 { font-size: 1.7rem; }

    .dash-card { padding: 14px; }
    .dash-card .dash-card-header h3 { font-size: 0.95rem; }

    .emergency-card { padding: 12px; }
    .emergency-card .emergency-number { font-size: 1.1rem; }

    .travel-mode-btn { padding: 6px 10px; font-size: 0.75rem; }
    .tracking-grid { grid-template-columns: 1fr; }

    .live-poi-bar, .route-poi-bar { flex-direction: column; align-items: stretch; }
    .live-poi-label, .route-poi-label { justify-content: center; }
    .live-poi-toggle, .route-poi-toggle { justify-content: center; }
    .live-poi-count, .route-poi-count { text-align: center; margin-left: 0; margin-top: 4px; }

    #map-container { height: 300px; }
    .route-map-container { height: 260px; }

    .translator-input-group { min-height: 80px; }
    .phrase-btn { font-size: 0.8rem; padding: 8px; }

    .footer-content { padding: 0 10px; }

    .chatbot-panel { bottom: 70px; max-height: 55vh; }
    .sos-float { bottom: 140px; right: 12px; width: 50px; height: 50px; font-size: 0.8rem; }
    #language-selector { bottom: 100px; right: 10px; }

    .attraction-chip { flex: 1 1 100%; max-width: 100%; }
}

/* ── SMALL MOBILE (≤ 480px) ── */
@media (max-width: 480px) {
    .section { padding: 24px 10px; }
    .section-header h2 { font-size: 1.15rem; }
    .hero-content h1 { font-size: 1.5rem; }
    .hero-content p { font-size: 0.85rem; }

    .dash-card { padding: 12px; border-radius: 8px; }
    .dash-card .dash-card-header .dash-icon { width: 36px; height: 36px; font-size: 1rem; }
    .dash-card .dash-card-header h3 { font-size: 0.9rem; }

    .emergency-card { padding: 10px; border-radius: 8px; }
    .emergency-card .emergency-icon { width: 40px; height: 40px; font-size: 1rem; }
    .emergency-card .emergency-number { font-size: 1rem; }
    .emergency-card .emergency-name { font-size: 0.8rem; }

    .danger-card { padding: 12px; }
    .danger-card h3 { font-size: 0.95rem; }

    .route-info .route-stat { font-size: 0.8rem; padding: 6px 8px; }
    .travel-mode-btn { padding: 5px 8px; font-size: 0.7rem; }

    #map-container { height: 260px; }
    .route-map-container { height: 220px; }

    .tracking-grid { grid-template-columns: 1fr; }
    .tracking-item { padding: 8px 10px; }
    .tracking-value { font-size: 0.8rem; }

    .profile-grid { grid-template-columns: 1fr; }

    .login-card { padding: 20px 16px; }
    .login-card h1 { font-size: 1.3rem; }
    .login-card .login-subtitle { font-size: 0.85rem; }
    .form-group input, .form-group select { padding: 10px 12px; font-size: 0.9rem; }

    .chatbot-panel { width: calc(100vw - 10px); left: 5px; right: 5px; bottom: 65px; }
    .chatbot-messages { padding: 10px; }
    .chatbot-input-area { padding: 8px; }

    .notif-panel { width: calc(100vw - 16px); left: 8px; right: 8px; }

    .translator-container { gap: 10px; }
    .translator-input-group textarea { font-size: 0.9rem; }

    .attraction-chip { padding: 10px; }
    .attraction-info span { font-size: 0.78rem; }

    .welcome-banner { padding: 16px; }
    .welcome-banner h2 { font-size: 1.3rem; }
    .welcome-banner p { font-size: 0.85rem; }
}

/* ── TINY MOBILE (≤ 360px) ── */
@media (max-width: 360px) {
    .section { padding: 20px 8px; }
    .section-header h2 { font-size: 1.05rem; }
    .hero-content h1 { font-size: 1.3rem; }

    .dash-card { padding: 10px; }
    .emergency-card { padding: 8px; }
    .emergency-card .emergency-number { font-size: 0.9rem; }

    .travel-mode-btn { padding: 4px 6px; font-size: 0.65rem; }

    .profile-grid { gap: 8px; }
    .profile-item { padding: 8px; }

    .btn { padding: 8px 12px; font-size: 0.8rem; }

    .login-card { padding: 16px 12px; }
    .form-group input, .form-group select { padding: 8px 10px; font-size: 0.85rem; }
}

/* ── LANDSCAPE ON MOBILE ── */
@media (max-height: 500px) and (orientation: landscape) {
    .section { padding: 20px 16px; }
    .hero-content h1 { font-size: 1.5rem; }
    #map-container { height: 250px; }
    .route-map-container { height: 200px; }
    .chatbot-panel { max-height: 80vh; }
    .login-card { max-height: 90vh; overflow-y: auto; }
}

/* ── PRINT STYLES ── */
@media print {
    .sos-float, .chatbot-fab, #language-selector, .notif-bell,
    .hamburger, .nav-links, #main-nav { display: none !important; }
    .section { page-break-inside: avoid; }
    body { background: white; color: black; }
}
"""

# Check if there's already a comprehensive responsive block at the end
# We'll append our new responsive CSS
css = css.rstrip() + '\n' + responsive_css + '\n'

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print(f"Added comprehensive responsive CSS ({len(css)} bytes)")
