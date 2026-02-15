cat > db/README.md << 'EOF'
## Deni Database

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
