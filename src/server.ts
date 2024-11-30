// import {
//   AngularNodeAppEngine,
//   createNodeRequestHandler,
//   isMainModule,
//   writeResponseToNodeResponse,
// } from '@angular/ssr/node';
// import express from 'express';
// import { dirname, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, '../browser');

// const app = express();
// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/**', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use('/**', (req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next(),
//     )
//     .catch(next);
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env['PORT'] || 4000;
//   app.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// /**
//  * The request handler used by the Angular CLI (dev-server and during build).
//  */
// export const reqHandler = createNodeRequestHandler(app);


import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import fs from 'fs';

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const serverDistFolder = dirname(fileURLToPath(import.meta.url)); // Current folder
const browserDistFolder = resolve(serverDistFolder, '../browser'); // Browser folder
const USERS_FILE = 'C:\\Users\\z0051tze\\Desktop\\Facultate\\Sem2\\DAW\\Exemplu Angular\\login_exemple\\src\\users.json' // Path to users.json in the current folder

const app = express();
const angularApp = new AngularNodeAppEngine();
// Optional: Debugging the path

// Additional server logic


interface User {
  username: string;
  password: string;
}



// Middleware to parse JSON requests
app.use(express.json());

/**
 * Ensure the users file exists.
 */
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

/**
 * API endpoint: Login
 */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const user = users.find((u:User) => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ message: 'Invalid username or password.' });
  }
});

/**
 * API endpoint: Sign-Up
 */
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  if (users.find((u:User) => u.username === username)) {
    res.status(400).json({ message: 'Username already exists.' });
  } else {
    users.push({ username, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
    res.json({ message: 'Sign-up successful!' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
