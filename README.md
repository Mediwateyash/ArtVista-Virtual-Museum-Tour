# ArtVista - Virtual Museum Tour & Ticket Booking System

ArtVista is a full-stack web application that allows users to explore museums virtually, view artifacts, and book physical visit tickets.

## Features

-   **User Authentication**: Register and Login securely.
-   **Virtual Tour**: Step-by-step virtual tour of museum sections and artifacts.
-   **Ticket Booking**: Book tickets for physical visits and generate PDF tickets.
-   **Admin Panel**: Manage museums, sections, artifacts, and bookings.
-   **Responsive Design**: Beautiful and modern UI.

## Tech Stack

-   **Frontend**: HTML, CSS, JavaScript, EJS
-   **Backend**: Node.js, Express
-   **Database**: MongoDB, Mongoose
-   **Others**: PDFKit (Ticket Generation), Bcrypt (Auth)

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Ensure `.env` file exists with the following content:
    ```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/artvista
    SESSION_SECRET=artvista_secret_key_123
    ```

3.  **Seed Database** (Optional but recommended for first run):
    ```bash
    node seed.js
    ```
    This will create:
    -   **Admin User**: `admin@artvista.com` / `admin123`
    -   **Normal User**: `john@example.com` / `admin123`
    -   Sample Museum, Sections, and Artifacts.

4.  **Run the Application**:
    ```bash
    npm start
    ```
    Or for development with nodemon:
    ```bash
    npx nodemon server.js
    ```

5.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

-   `models/`: MongoDB Schemas
-   `views/`: EJS Templates
-   `controllers/`: Request Logic
-   `routes/`: API Routes
-   `public/`: Static Assets (CSS, Images)
-   `middleware/`: Auth Middleware
