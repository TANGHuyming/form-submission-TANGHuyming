# Form Submission (Homework 7)

A small Express + Handlebars application that accepts a user registration form and a profile picture upload, then shows a profile page.

## Project layout

- `app.js` — Express app and route handlers
- `package.json` — npm metadata and scripts
- `public/` — static assets (CSS, client JS, `uploads/` for images)
- `views/` — Handlebars templates (`register.hbs`, `profile.hbs`, layouts/)

## Prerequisites

- Node.js (v14+ recommended)
- npm

## Install

Run from the project root:

```bash
npm install
```

## Run

Start the server:

```bash
npm start
```

By default the app listens on port `3000` (or the value of the `PORT` env var if provided).

## Usage

- Open the registration form at `/register`.
- Submit the form (multipart/form-data) including a profile image.
- The uploaded image is stored in `public/uploads` and displayed on the profile page.

Routes

- `GET /register` — show the registration form
- `POST /register` — accept form + file upload and redirect to the profile
- `GET /` or `GET /profile` — show the submitted profile (depends on implementation)

## Notes and assumptions

- The app stores uploads in `public/uploads` (ensure the folder is writable).
- Allowed image types are typically `.jpg`, `.jpeg`, `.png` (check `app.js` for specific validation).
- The app may disable the `X-Powered-By` header for security (see `app.disable('x-powered-by')`).

## Troubleshooting

- If the server does not start, check `package.json` scripts and node version.
- If uploads fail, verify `public/uploads` exists and has correct permissions.

## Files to inspect

- `app.js` — server entry and routes
- `views/` — Handlebars templates used by the app
- `public/uploads` — runtime folder for uploaded images

---

If you'd like, I can: run the tests, add a `.gitignore` entry for `public/uploads`, or update the README with screenshots and example form fields. Which would you prefer next?
