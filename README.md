# FemoPay Server

FemoPay Server is a backend application built with Node.js and Express.js. It provides APIs for user authentication, email verification, and other functionalities required for the FemoPay platform.

## Features

- **User Authentication**: Sign-up, sign-in, and sign-out functionality with JWT-based authentication.
- **Email Verification**: OTP-based email verification for secure user registration.
- **Role-Based Access Control**: Middleware to restrict access based on user roles.
- **Rate Limiting & Bot Detection**: Integrated with Arcjet for enhanced security.
- **Database Integration**: MongoDB with Mongoose for data modeling and management.
- **Email Notifications**: Nodemailer for sending OTPs and other email notifications.

## Project Structure

├── app.js # Main application entry point ├── config/ # Configuration files (e.g., environment variables, Arcjet, Nodemailer) ├── controllers/ # API controllers ├── database/ # Database connection setup ├── middlewares/ # Custom middlewares (e.g., authentication, error handling) ├── models/ # Mongoose models for MongoDB ├── routes/ # API route definitions ├── utils/ # Utility functions (e.g., email templates, email sending) └── package.json # Project dependencies and scripts




## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd Femopay-startup



 # Install dependencies:

Set up environment variables:

Create .env.development.local and .env.production.local files based on the provided examples and do well to request fro the .env keys.
Start the development server:

npm run dev


# API Endpoints
Authentication Routes (/api/v1/auth)
POST /sign-up: Register a new user.
POST /sign-in: Log in an existing user.
POST /verify-otp: Verify email using OTP.
POST /resend-otp: Resend OTP to the user's email.
POST /refresh-token: Refresh access token.
POST /sign-out: Log out the user.
Technologies Used
Node.js: Backend runtime.
Express.js: Web framework.
MongoDB: Database.
Mongoose: ODM for MongoDB.
Nodemailer: Email service.
Arcjet: Security and rate-limiting.
JWT: Authentication.

