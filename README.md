# barber-shop

Web application for barber shops

## Changelog

### v0.1.0 - 2026-04-24

#### Added
- React app with Vite
- Firebase SDK integration (authentication & Firestore)
- AuthContext with login/register/logout
- CI/CD pipeline (GitHub Actions → Firebase Hosting)
- Landing page with:
  - Fixed navigation with booking CTA
  - Hero section with stats
  - Services section (6 services with pricing)
  - About section
  - Opening hours & location
  - Contact/booking form
  - Footer with social links

#### Project Structure
```
barber-shop/
├── src/
│   ├── firebase/config.js     # Firebase initialization
│   ├── context/AuthContext.jsx
│   ├── pages/Home.jsx         # Landing page
│   ├── pages/Home.css
│   ├── App.jsx
│   └── main.jsx
├── .github/workflows/          # CI/CD
├── firebase.json              # Hosting config
└── package.json
```

#### Deployment
- Live URL: https://barber-shop-c34cb.web.app
- Deploy: `npm run build && firebase deploy`
- Auto-deploy on push to master
