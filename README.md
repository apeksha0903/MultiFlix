# MultiFlix

MultiFlix is a full-stack streaming platform inspired by modern subscription-based media apps. It combines authentication, multi-profile management, content discovery, watchlist/history tracking, personalized recommendations, and shared account billing in one experience.

## Overview

The application is split into two main parts:

- A React + TypeScript frontend for the user experience
- An Express + TypeScript backend with MongoDB persistence and TMDb integration

## Key Features

- User authentication with email/password and Google OAuth
- Role-based access for owners and invited members
- Multiple profiles per account with isolated watch data
- Movie and TV browsing with search and detail pages
- Watchlist, watch history, and continue-watching support
- Personalized recommendations based on profile watch behavior
- Billing account management and member invite flow
- Responsive UI with animated page transitions

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Framer Motion

### Backend
- Express 5
- TypeScript
- MongoDB with Mongoose
- Passport.js
- JWT authentication
- Nodemailer / Resend / Mailtrap support

### Integrations
- TMDb API for movie and TV metadata
- Google OAuth for social sign-in

## Project Structure

```text
client/                 # Vite frontend
  src/
    api/                 # API wrappers and axios setup
    components/          # Reusable UI components
    contexts/            # Auth and profile providers
    hooks/               # Custom hooks
    pages/               # Route-based screens
    types/               # Shared TypeScript types
    utils/               # Helpers and formatters

server/                 # Express backend
  src/
    config/             # Passport and environment config
    db/                 # Database connection
    models/             # Mongoose schemas
    routes/             # API endpoints
    services/           # TMDb, recommendations, email providers
    utils/              # Auth helpers, mailer, constants
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ and npm
- A MongoDB instance running locally or remotely
- A TMDb API token
- Google OAuth credentials (optional, for Google sign-in)
- An email provider setup (optional, for invite emails)

## Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```
4. Configure the environment files shown above

## Running the Project

### Start the backend

```bash
cd server
npm run dev
```

The server will run on http://localhost:5000.

### Start the frontend

```bash
cd client
npm run dev
```

The frontend will run on http://localhost:5173.

## Available Scripts

### Server
- npm run dev — start the backend with nodemon
- npm run build — compile TypeScript to the dist folder
- npm start — run the built server

### Client
- npm run dev — start the Vite development server
- npm run build — build the production bundle
- npm run preview — preview the production build locally
- npm run lint — run the linter

## Recommendation Engine

MultiFlix includes a profile-level recommendation system that:

- Generates recommendations per profile based on that profile's watch history
- Uses TMDb genre metadata to build a weighted preference profile
- Falls back to trending content for new profiles with no history
- Excludes titles the profile has already watched
- Caches metadata and results to reduce repeated API calls

## Notes

- The API includes a health check endpoint at /health
- Invite-based onboarding is supported for shared-family account membership
- In development mode, invite links are returned in the API response for easier testing

