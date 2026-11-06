# Virtual Travel Agency – Bharat Suraksha

**A Tourist Safety Portal for safer travel across India**  
*Smart India Hackathon (SIH) 2026 Project*

---

## 📌 About the Project

**Virtual Travel Agency** is a web-based tourism project developed for the **Smart India Hackathon (SIH) 2026**. Its main application, **Bharat Suraksha**, is designed to help travellers explore India while staying informed about travel safety, nearby essential services, emergency support and destination information.

Rather than functioning only as a conventional travel-planning website, Bharat Suraksha focuses on the safety and well-being of tourists. It brings together location tracking, danger-zone information, emergency contacts, multilingual assistance, nearby-place discovery, and a built-in tourist guide in one interface.

The application is built primarily with HTML, CSS and JavaScript and is designed to run in a web browser.

## 🎯 Project Objectives

- Make useful travel-safety information easier for tourists to access.
- Help travellers identify areas marked with potential safety or natural-disaster risks.
- Provide quick access to emergency numbers and personal emergency contacts.
- Help users share and monitor their location while travelling.
- Reduce language barriers through multilingual translations and a tourist phrasebook.
- Help tourists discover nearby hospitals, police stations, hotels and restaurants along with their price and ratings.
- Provide destination information, including attractions, food, accommodation, transport and travel tips.

## ✨ Key Features

### 1. User Registration and Login
- Provides registration and login screens.
- Collects traveller details such as name, password, nationality, preferred language, and travel-related information.
- Stores the application's user information in the browser's `localStorage`.
- Supports returning-user access through locally stored session information.

> **Note:** This is a front-end demonstration of authentication. It does not use a server-side authentication system or a secure user database.

### 2. Live Location and Tracking
- Uses the browser's Geolocation API to request the traveller's current location.
- Displays the user's position on an interactive map.
- Supports starting and stopping location tracking.
- Maintains a tracking trail and displays travel-related information such as distance and movement details.
- Includes a location-sharing option for sharing the traveller's current location.

Location access requires the user's permission and a browser environment that supports geolocation. In most browsers, geolocation requires HTTPS or a trusted local development environment.

### 3. Interactive Map and Nearby Places
- Uses **Leaflet** to display an interactive map.
- Uses map tiles from **OpenStreetMap**.
- Displays nearby points of interest (POIs), with categories such as:
  - Hospitals
  - Police stations
  - Hotels
  - Restaurants
- Provides controls to show, filter, and refresh nearby places.
- Includes markers and information pop-ups for places displayed on the map.

Some map and place-discovery functions rely on external map or geographic services, so an internet connection may be required.

### 4. Danger-Zone Information and Alerts
- Displays predefined danger-zone information for locations across India.
- Categorises risks, including high-risk areas, moderate-risk areas, and areas affected by natural hazards.
- Shows descriptions and safety advisories associated with listed zones.
- Displays danger zones on the map and provides alerts when the traveller is detected near a marked zone.

**Important:** The danger-zone information is application data, not a live official government warning feed. It should not be treated as a substitute for current government advisories, local authorities, weather alerts, or emergency instructions.

### 5. Emergency Assistance and SOS
- Provides quick access to emergency contact information, including services such as ambulance, police, fire services, and helplines.
- Includes an SOS interface for quick access to emergency assistance.
- Allows users to add and manage personal emergency contacts.
- Saves personal contacts in browser `localStorage`.

Always verify emergency numbers and local contact details before relying on them while travelling.

### 6. Multilingual Support and Translator
- Includes a language selector and translated interface text.
- Provides translation-related functionality for travellers.
- Includes language data in `translations.js`.
- Includes a tourist phrasebook in `phrasebook.js`, containing common phrases in multiple Indian languages.
- Supports useful phrase categories such as greetings, directions, help, safety, emergencies, accommodation, and food.
- Includes speech and copy-related controls for translation output.

The phrasebook provides locally stored phrases. Other translation functionality may depend on the implementation and availability of external services.

### 7. Tourist Guide Chatbot
- Includes a built-in, rule-based tourist guide chatbot.
- Uses destination information stored in `chatbot.js`.
- Provides information about supported cities and destinations.
- Can respond to topics such as:
  - Tourist attractions
  - Local food
  - Hotels and accommodation
  - Transport options
  - Travel tips
  - Weather and packing guidance
- Provides suggested questions to help users explore the guide.

The chatbot uses information included in the project's JavaScript data. It is not a general-purpose AI chatbot and its information may not always reflect current prices, opening hours, or travel conditions.

### 8. Notifications and Personalisation
- Includes a notification panel for travel-related information and alerts.
- Generates notification content for categories such as weather, safety, crowd conditions, accessibility, and general information.
- Provides controls to read, dismiss, filter, or clear notifications.
- Supports dark and light themes.
- Saves selected application information in browser storage.

Some notification content is generated by the application and should not be interpreted as a verified real-time alert unless its source is independently confirmed.

### 9. Route and Travel Information
- Includes a route map interface.
- Uses external routing functionality, including OSRM, for route-related information.
- Provides travel-mode controls and points-of-interest information along routes.

Route availability and accuracy depend on the external routing service and network connectivity.

---

## 🛠️ Technologies Used

| Technology / Service | Purpose |
|---|---|
| HTML5 | Structure and content of the web application |
| CSS3 | Layout, styling, responsive design, themes, and visual effects |
| JavaScript | Application logic, user interactions, map controls, tracking, alerts, and chatbot behaviour |
| Leaflet | Interactive map display |
| OpenStreetMap | Map tile data |
| Font Awesome | Icons used throughout the interface |
| Browser Geolocation API | Access to the user's location, with permission |
| Browser `localStorage` | Local storage of user details, contacts, and application preferences |
| OSRM | Route calculation functionality |
| External geographic services | Supporting place search and location-related features where used |

No Node.js package installation is required for the basic static website launch.

## 📂 Project Structure

```text
Virtual_Travel_Agency/
│
├── README.md
│
└── Tourism/
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── chatbot.js
    ├── phrasebook.js
    ├── translations.js
    │
    ├── photos/
    │   ├── 01-roomie-yellow.jpeg
    │   ├── 02-night-moon.jpeg
    │   ├── 03-sunset-view.jpeg
    │   └── ... (other image assets)
    │
    ├── Python development and update scripts
    │   ├── add_all_india_zones.py
    │   ├── add_danger_zones.py
    │   ├── add_foreign_langs.py
    │   ├── add_foreign_translations.py
    │   ├── add_more_pois.py
    │   ├── enhance_chatbot.py
    │   ├── enhance_guide.py
    │   ├── enhance_live_map_poi.py
    │   ├── enhance_notifications.py
    │   ├── enhance_tracking.py
    │   ├── update_attractions.py
    │   ├── update_route_osrm.py
    │   └── ... (additional update and repair scripts)
    │
    ├── JavaScript development files
    │   ├── app_chatbot_tmp.js
    │   ├── live_poi_block.js
    │   ├── more_cities.js
    │   └── ... (additional helper and repair files)
    │
    └── Presentation and supporting files
        ├── BharatSuraksha_SIH2026.pptx
        ├── BharatSuraksha.zip
        └── other supporting archives
```

### Main Application Files

| File | Description |
|---|---|
| `Tourism/index.html` | Main browser entry point. Contains the page structure and, in the submitted project, also includes substantial inline CSS and JavaScript for the application. |
| `Tourism/styles.css` | Stylesheet containing the application's visual design, layout, themes, and responsive styling. |
| `Tourism/app.js` | Main application logic, including location tracking, map features, danger zones, emergency contacts, notifications, profile handling, and related interactions. |
| `Tourism/chatbot.js` | Destination data and logic for the tourist guide chatbot. |
| `Tourism/phrasebook.js` | Multilingual tourist phrases stored locally in JavaScript data. |
| `Tourism/translations.js` | Text translations used for the multilingual interface. |
| `Tourism/photos/` | Image assets used by the project. |
| `Tourism/*.py` and supporting `*.js` files | Development scripts used to add, update, enhance, or repair application content and functionality. They are not required to launch the basic website. |

**Implementation note:** The submitted `index.html` contains a large amount of embedded styling and application code, while separate CSS and JavaScript files are also present in the repository. The main page is therefore the file to open when running the submitted website. The development/update scripts are supporting project files and should not be assumed to run automatically when the page loads.

---

## 🚀 How to Run the Project

### Option 1: Open the HTML File Directly

1. Download or clone this repository.
2. Open the project folder.
3. Navigate to the `Tourism` folder.
4. Locate `index.html`.
5. Double-click `index.html`, or right-click it and choose **Open with** your preferred browser.
6. Allow location access if you want to try the live-location features.

### Option 2: Run with Visual Studio Code

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open VS Code.
3. Select **File → Open Folder**.
4. Choose the downloaded `Virtual_Travel_Agency` folder.
5. Open the `Tourism` folder and locate `index.html`.
6. If you use the **Live Server** extension, right-click `index.html` and select **Open with Live Server**.
7. The application should open in your default browser.

A local server is recommended for testing browser features. For deployment, use a host that serves the site over HTTPS so that browser geolocation can work in supported browsers.

### Requirements

- A modern web browser such as Google Chrome, Microsoft Edge, or Firefox.
- An internet connection for externally hosted libraries, map tiles, and external geographic or routing services.
- Location permission for live tracking.
- A local web server or HTTPS hosting for reliable geolocation access.

There is no `package.json` in the submitted project, so the basic website does not require `npm install` or a Node.js build command.

---

## 💾 Data Storage and Privacy Notes

The application uses browser `localStorage` for some information, including user-related data and personal emergency contacts. This means:

- The data is stored in the browser on the device being used.
- It is not automatically synchronised between different devices.
- Clearing browser data may remove saved information.
- This implementation should be treated as a project prototype, not as a production-ready account or data-management system.

Location tracking uses browser location permissions. Users should only grant location access when they are comfortable sharing their location with the application.

---

## ⚠️ Limitations and Safety Disclaimer

- This project is an academic/prototype web application and is not a replacement for official emergency services.
- Danger-zone details, destination guides, and other bundled information may become outdated.
- Map, route, and nearby-place results may depend on third-party services and internet availability.
- Location tracking depends on device hardware, browser support, user permission, and network conditions.
- Local browser storage is not a secure backend database.
- The login interface is not equivalent to production-grade authentication.
- Users should confirm emergency contacts, travel restrictions, weather conditions, and safety advisories through official sources before making travel decisions.

**In an actual emergency, contact the appropriate local emergency service or authority. Do not rely solely on this application.**

## 🔮 Future Scope

Possible future improvements include:

- Adding a secure backend and database for user accounts and emergency contacts.
- Integrating verified, regularly updated government safety and weather alerts.
- Improving the reliability and coverage of nearby-place information.
- Adding secure, consent-based live location sharing with trusted contacts.
- Providing offline access to essential safety information and phrasebook content.
- Adding more destinations, languages, and accessibility information.
- Testing the application across different devices, browsers, and network conditions.

## 👥 Project

**Project Name:** Virtual Travel Agency  
**Application Name:** Bharat Suraksha – Tourist Safety Portal  
**Project Context:** Smart India Hackathon (SIH) 2026
**Author:** Oishee Biswas

---

*Bharat Suraksha aims to make exploring India safer by bringing travel information and essential safety tools together in one place.*
