# Fitness Tracker App

Full-stack fitness dashboard built with Node.js, Express, MongoDB, and a Vite + React front end. It covers authentication, multi-profile management, workouts, goals, nutrition, challenges, wearable data, notifications, and offline/voice experiences.

## Project Structure
- server/ - Express API with MongoDB, JWT, Nutritionix, Firebase, and wearable services.
- client/ - React SPA (Tailwind CSS, React Query, Recharts, socket.io-client, barcode scanning, service worker, Firebase messaging helpers).

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB instance (local or hosted)
- Optional keys: Nutritionix, SMTP, Firebase (web + service account), Fitbit or other wearable API tokens

## Backend Setup (server/)
`
cd server
cp .env.example .env
npm install
npm run dev
`
Set at least MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, and CLIENT_ORIGIN. Optional integrations (Nutritionix, SMTP, Firebase) fall back to mocked data or console logging when keys are missing.

## Frontend Setup (client/)
`
cd client
cp .env.example .env
npm install
npm run dev
`
VITE_API_BASE_URL should point to the backend (default http://localhost:5000). Fill the Firebase fields to enable push notifications.

## Feature Highlights
- Authentication with refresh tokens, password reset emails, and multi-profile households
- Workout logging, auto calorie estimates, real-time GPS tracking, socket-driven activity feed
- Goal creation, progress history, achievement badges, and dynamic workout suggestions
- Nutrition search and barcode scanning via Nutritionix; daily calorie charts
- Public challenges with leaderboards and social sharing (Web Share API)
- Wearable connections with sync endpoints plus health metric logging and dashboards
- Voice command shortcuts (Web Speech API), responsive Tailwind layout, service worker offline mode
- Push/email notifications via Firebase Cloud Messaging and Nodemailer

## Validation Flow
1. Register and log in, verifying refresh token issuance.
2. Add profiles, log workouts, create goals, and confirm dashboard charts/suggestions update.
3. Start a live activity and observe route updates; stop to persist a workout.
4. Search or scan foods to log nutrition and inspect the calorie trend chart.
5. Create a challenge, join it, and update progress to refresh the leaderboard.
6. Link a wearable (mock tokens accepted) and trigger a sync.
7. Configure Firebase/SMTP if available, enable push, and send a test notification.
8. Toggle offline mode in dev tools to confirm cached pages load via the service worker.

## Scripts
### Server
- 
pm run dev - start API with nodemon
- 
pm start - start API in production mode

### Client
- 
pm run dev - Vite development server
- 
pm run build - production bundle
- 
pm run preview - preview built assets

## Notes
- Real integrations need valid credentials; mocked responses keep the UI functional without them.
- Place the Firebase service account path in FIREBASE_SERVICE_ACCOUNT (backend) and web config values in client/.env for push notifications.
- Consider adding Docker Compose or CI workflows for production deployments.

Happy tracking!
