# Wallet Generator

This is a web application to generate and manage cryptocurrency wallets for Bitcoin, Ethereum, and Solana.

## Features

*   **User Authentication:** Secure signup and login functionality.
*   **Multi-Currency Support:** Generate and manage wallets for Bitcoin, Ethereum, and Solana.
*   **Secure Mnemonic Storage:** Encrypts and stores your mnemonic phrase securely.
*   **View Wallet Details:** Easily view your public addresses for each currency.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js and npm (or yarn)
*   MongoDB

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/hawk200545/wallet-gen
    cd wallet-gen
    ```

2.  **Install Frontend Dependencies:**
    ```sh
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```sh
    cd server
    npm install
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `server` directory and add the following:
    ```
    MONGO_URL=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the `server` directory:
    ```sh
    npm run dev
    ```
    The server will start on the port specified in `server/.config/config.js`.

2.  **Start the Frontend Development Server:**
    From the root project directory:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if specified).

## Available Scripts

### Frontend (root directory)

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run preview`: Serves the production build locally.

### Backend (`/server` directory)

*   `npm run start`: Starts the server in production mode.
*   `npm run dev`: Starts the server in development mode with `nodemon`.
