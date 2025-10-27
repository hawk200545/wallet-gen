# Hawk Wallet (React Native)

Hawk Wallet is a mobile-first application built with React Native and Expo. It lets users sign up, authenticate, and manage deterministic Bitcoin, Ethereum, and Solana wallets generated from a secure mnemonic phrase.

## Features

- **User authentication** against the existing Node/Express backend.
- **Deterministic wallet derivation** for Bitcoin, Ethereum, and Solana using a single mnemonic.
- **Mnemonic management** with local AES-GCM decryption so the phrase never leaves the device in plain text.
- **Clipboard helpers** to copy keys and a modal workflow to create additional wallets per coin.

## Tech Stack

- **Mobile:** React Native, Expo, React Navigation, AsyncStorage
- **Crypto tooling:** `@scure/bip32`, `@scure/bip39`, `@stablelib/aes-gcm`, `tweetnacl`
- **Backend:** Node.js, Express.js (existing `server/` folder)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (included with Node)
- Expo CLI (`npx expo`) – optionally install globally for convenience
- Backend requirements (MongoDB, etc.) remain the same as before

### Installation

```bash
# Clone the repository
git clone https://github.com/hawk200545/wallet-gen.git
cd wallet-gen

# Install mobile dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Environment Variables

The mobile app expects an Expo public environment variable pointing at the backend API root. Create an `.env` file in the project root with:

```
EXPO_PUBLIC_BACKEND_URL=https://your-backend-host
```

Expo automatically exposes variables prefixed with `EXPO_PUBLIC_` to the JavaScript runtime.

### Running the App

```bash
# Start the Expo development server
npm start

# Optional shortcuts once the dev server is running
# Press "a" to launch Android (emulator/device)
# Press "i" to launch iOS simulator (macOS only)
# Press "w" to open the web build in a browser
```

The server continues to run independently:

```bash
cd server
npm run dev
```

### Available Scripts

- `npm start` – launch the Expo dev tools
- `npm run android` – build & run the native Android app (requires Android tooling)
- `npm run ios` – build & run on the iOS simulator (macOS + Xcode)
- `npm run web` – run the Expo web target
- `npm run lint` – lint the mobile source using ESLint

Backend scripts inside `server/` are unchanged:

- `npm run dev` – start the Express API with nodemon
- `npm run start` – start the Express API in production mode

## Notes on the Migration

- All Vite/React DOM assets were removed in favor of a React Native layout layer.
- LocalStorage usage moved to AsyncStorage with hydration on app start.
- Web crypto dependencies were replaced with React Native friendly libraries (`@stablelib/aes-gcm`, `@noble/hashes`, etc.).
- UI is rebuilt with React Native primitives and React Navigation replaces React Router.
- Wallet derivation logic now uses pure JavaScript crypto libraries suitable for the mobile runtime.

Refer to `App.js` and the `src/` directory for the new entry point, navigation stack, context provider, and modularized components.
