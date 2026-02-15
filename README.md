## Sprint 1 RTDB Smoke Test (CRUD)

This project includes a basic Firebase Realtime Database smoke test screen to verify:
Create, Read, Update, Delete against the RTDB instance.

### Quick Start

1) Install dependencies

npm install

2) Configure Firebase env vars

Copy the template:

cp .env.example .env

Fill in the values in .env using Firebase Console:
Project Settings → General → Your apps → Web app config
Realtime Database → Data tab → copy the database URL

3) Start Expo

npx expo start -c

Open the app in Expo Go, go to the Home tab, and use the CRUD buttons.

### What the CRUD test does

The screen in:

app/(tabs)/index.tsx

runs CRUD operations on this RTDB path:

test/hello

Actions:
Create / Read
Writes an object to test/hello and reads it back

Update
Patches test/hello with updated fields

Delete
Removes test/hello entirely

### How to change what CRUD tests

Insertion point:
app/(tabs)/index.tsx

Look for the path constant:

const path = "test/hello";

Change that string to test a different node, for example:

test/smoke
events/demoEvent1
trucks/demoTruck1

If you change the path, make sure RTDB rules allow read and write for that node.

### Firebase configuration

Firebase is initialized in:

src/firebase.js

This file reads config from environment variables:

EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_DATABASE_URL
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID

Do not commit your .env file. Only commit .env.example.

### Troubleshooting

If CRUD buttons time out:
- Confirm EXPO_PUBLIC_FIREBASE_DATABASE_URL is correct and includes https
- Restart Metro with cache cleared:

npx expo start -c

If you see permission denied:
- Check RTDB rules for the node being written
- Confirm you are writing to the intended path


# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
