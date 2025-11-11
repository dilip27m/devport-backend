 DevPort – Backend Setup Guide 
1) Project Overview

The DevPort backend is built using Express.js and MongoDB.
It acts as the core API for saving user data, loading portfolio information, managing authentication, and handling deployment tasks.

It connects to:

MongoDB (for storing user data)

Cloudinary (for image hosting)

Nodemailer / Gmail SMTP (for sending verification or deploy emails)

The backend runs on http://localhost:5000
 and serves data to the Next.js frontend.

2️) Prerequisites

Before running the backend, make sure the following software is installed:

Node.js (v18 or above)

npm (comes with Node.js)

MongoDB (local or Atlas cluster)

Git

Optional tools:

Postman or curl (for testing APIs)

3️) Folder Structure (Backend Directory)

Ensure you are inside the backend/ folder.
You should see the following structure:

backend/
│── controllers/
│── models/
│── routes/
│── middleware/
│── server.js
│── package.json
│── .env
│── .env.example

4️) Create .env File

You already have a working .env file.
Here’s the correct content for your backend configuration 👇

PORT=5000
MONGO_URI="mongodb+srv://devport:devport@cluster0.qrflpak.mongodb.net/Devport"
JWT_SECRET=this_is_a_super_long_and_random_secret_string_for_my_jwt_12345

CLOUDINARY_CLOUD_NAME=dd2ltpkk1
CLOUDINARY_API_KEY=335626455923257
CLOUDINARY_API_SECRET=T62uFqhMlbrNBeeh26lqRy7iukU

EMAIL_USER=devport120@gmail.com
EMAIL_PASS=devport3@123


Explanation:

PORT → Server runs on port 5000

MONGO_URI → Connection string for MongoDB Atlas

JWT_SECRET → Used for authentication tokens

CLOUDINARY_* → Credentials for image uploads

EMAIL_* → For sending emails via Gmail

 Security Note :
These credentials are for local demonstration only. In production, they should be hidden securely using environment secrets.

5️) Install Dependencies

Open your terminal and navigate to the backend folder:

cd backend
npm install


This installs all necessary dependencies (Express, Mongoose, CORS, dotenv, Cloudinary, Nodemailer, etc.).

6️) Start the Server

After installation completes, start the backend using:

npm run dev


If configured correctly, you should see:

Server running on port 5000
Connected to MongoDB


 The server is now live at:
 http://localhost:5000

 7️) Verify API Endpoints

 8️) Common Errors & Fixes
Problem	 Solution
MongoNetworkError	Check your internet and MongoDB URI in .env
CORS errors	Ensure frontend URL is allowed (use cors() middleware)
Port already in use	Change PORT value in .env
“Cannot find module dotenv”	Run npm install dotenv
“ReferenceError: require is not defined”	Ensure you’re running in Node environment (not browser)

9️) optional: Testing Email / Image Upload

To test Cloudinary and email sending:

Use /api/upload (if implemented) to upload sample images

Test /api/sendEmail or similar route (if configured) to send demo mails

Cloudinary uploads should appear under your Cloudinary dashboard:
🔗 https://cloudinary.com/console

10) Project Summary

The DevPort backend provides the backbone for all portfolio operations.
It handles:

Saving and loading user data from MongoDB Atlas

Managing authentication via JWT

Hosting and retrieving images through Cloudinary

Sending deployment or verification emails through Nodemailer

Supporting real-time frontend updates and deployment triggers

Tech Stack:

Node.js + Express.js

MongoDB + Mongoose

Cloudinary API

Nodemailer

JSON Web Tokens (JWT) for secure access


cd backend
npm install
npm run dev


Test all API endpoints on
http://localhost:5000/api

and verify data flow to the frontend through real-time updates and database persistence.
