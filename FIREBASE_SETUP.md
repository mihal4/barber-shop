# Firebase Configuration

## Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Build > Authentication > Get Started
   - Enable "Email/Password" sign-in method
4. Enable Firestore Database:
   - Go to Build > Firestore Database > Create database
   - Start in test mode (or set security rules)
5. Get your config:
   - Go to Project Settings > Your apps > Web app
   - Copy the firebaseConfig object

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
