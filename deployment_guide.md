# ArtVista Deployment Guide

This guide will help you deploy your ArtVista application to the cloud. We will use **GitHub** for version control, **MongoDB Atlas** for the database, and **Render** for hosting the application (it's the easiest and most reliable free option for this type of app).

## Step 1: Push to GitHub

1.  **Create a Repository**: Go to [GitHub](https://github.com/new) and create a new repository named `artvista`.
2.  **Push Code**: Run the following commands in your terminal (if you haven't already):

```bash
git remote add origin https://github.com/YOUR_USERNAME/artvista.git
git branch -M main
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your actual GitHub username)*

## Step 2: Setup MongoDB Atlas (Database)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  **Create a Cluster**: Select the **Shared (Free)** cluster.
3.  **Create a Database User**:
    *   Go to **Database Access** -> **Add New Database User**.
    *   Enter a username and password (e.g., `artvista_admin` / `your_secure_password`).
    *   **IMPORTANT**: Remember this password!
4.  **Network Access**:
    *   Go to **Network Access** -> **Add IP Address**.
    *   Select **Allow Access from Anywhere** (`0.0.0.0/0`). This allows Render to connect to your database.
5.  **Get Connection String**:
    *   Go to **Database** -> **Connect** -> **Drivers**.
    *   Copy the connection string. It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with the password you created in step 3.

## Step 3: Deploy to Render (Web Service)

1.  Go to [Render Dashboard](https://dashboard.render.com/) and sign up/login.
2.  Click **New +** and select **Web Service**.
3.  **Connect GitHub**: Connect your GitHub account and select the `artvista` repository.
4.  **Configure Service**:
    *   **Name**: `artvista-tour` (or any unique name)
    *   **Region**: Choose the one closest to you (e.g., Singapore or Frankfurt).
    *   **Branch**: `main`
    *   **Root Directory**: Leave blank (or `.`)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Plan**: Free
5.  **Environment Variables**: Scroll down to "Environment Variables" and add the following:
    *   `MONGO_URI`: Paste your MongoDB connection string from Step 2.
    *   `SESSION_SECRET`: Enter a random secret string (e.g., `my_super_secret_key_123`).
    *   `NODE_ENV`: `production`
6.  **Deploy**: Click **Create Web Service**.

Render will now build and deploy your application. It might take a few minutes. Once done, you will get a URL (e.g., `https://artvista-tour.onrender.com`) where your app is live!

## Step 4: Create Admin on Live Site

Since the live database is empty, you need to create your admins again on the live site.

1.  **Wait for Deployment**: Ensure the Render deployment is "Live".
2.  **Access Console**: In the Render dashboard for your service, go to the **Shell** tab.
3.  **Run Script**: Run the same command you used locally to create admins:

```bash
node create_admin.js "Yash" "yash@artvista.com" "adminyash" "9876543211"
```

Repeat for other admins.

---
**Why Render instead of Vercel?**
Your application uses `Express.js` with `EJS` templates and `express-session`. This is a traditional server-side rendered application that requires a running server process. **Render** provides a persistent Node.js environment which is perfect for this. **Vercel** is serverless-first and works best with Next.js or static sites; deploying a standard Express app there requires complex configuration and often breaks session management.
