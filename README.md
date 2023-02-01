# Time Tracker

Tiny time tracker to keep track of time. LOL.

Enter task, start pomodoro or regular timer. Get a (weekly) report of your spent time.

Featuring stressful ticking sounds, unintuitive keyboard navigation & probably a lot of hidden bugs.

Quick & dirty prototype to serve my own time tracking needs.

## Screenshots
![Screenshot](assets/screenshot.jpg)

## Tech Stack
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file, and create a Firestore database.

`VITE_APP_FIREBASE_API_KEY`

`VITE_APP_FIREBASE_AUTH_DOMAIN`

`VITE_APP_FIREBASE_PROJECT_ID`

`VITE_APP_FIREBASE_STORAGE_BUCKET`

`VITE_APP_FIREBASE_MESSAGING_SENDER_ID`

`VITE_APP_FIREBASE_APP_ID`

## Run Locally

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Deployment
Modify the `.github/workflows/firebase-hosting-merge.yml` to match your project settings, or run the Firebase CLI tools for automatic deployment.

Configure `firestore.rules` file with proper security rules.

## Lessons Learned
- How much I love automatic Firebase deploy scripts even if they need some version number tweaking
- Grouping data
- How hard it is to document your own projects
- TypeScript is OK.

## Credits
### Audio files and license
Orangefreesounds.com License: The sound effect is permitted for non-commercial use under license  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
- https://orangefreesounds.com/ticking-noise/
- https://orangefreesounds.com/correct-answer-ding-sound-effect/
