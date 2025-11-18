# TinyURL Maker

A simple TypeScript terminal-based URL shortener using TinyURL API.

## Installation

1. Clone or download the project.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to compile TypeScript.

## Usage

Run `npm start` and enter the URL to shorten when prompted.

Or run `npm start "https://example.com"` to shorten a specific URL directly.

The shortened URL will be displayed.

## Code Explanation

The main code is in `src/index.ts`. Here's a breakdown:

- **Imports**:
  - `import fetch from 'node-fetch';`: Imports the fetch function for making HTTP requests to the TinyURL API.
  - `import * as readline from 'readline';`: Imports the readline module for handling user input in the terminal.

- **shortenUrl function**:
  - An async function that takes a URL string as input.
  - Uses `fetch` to send a GET request to `https://tinyurl.com/api-create.php?url=<encoded_url>`.
  - If the response is successful (`response.ok`), it reads the response as text (the shortened URL) and logs it.
  - If there's an error, it logs the error message.

- **Main logic**:
  - Checks if a URL is provided as a command-line argument (`process.argv[2]`).
  - If yes, calls `shortenUrl` with that URL.
  - If not, creates a readline interface to prompt the user for a URL, then calls `shortenUrl` and closes the interface.

This setup allows the tool to work both interactively and with direct arguments for flexibility.

## Build Output

The `dist/index.js` file is the compiled JavaScript output from your TypeScript source code (`src/index.ts`). Here's its purpose:

- **Compilation Target**: TypeScript code needs to be transpiled (compiled) to JavaScript because Node.js runs JavaScript, not TypeScript directly. The `tsc` command (TypeScript compiler) converts `src/index.ts` into `dist/index.js`.

- **Execution**: When you run `npm start`, it executes `node dist/index.js`, which is the runnable JavaScript version of your application.

- **Build Output**: The `dist` directory contains the production-ready code. It's excluded from version control (via `.gitignore` if present) and regenerated during builds to ensure it's always up-to-date with the source.

In summary, `src/index.ts` is your development code, while `dist/index.js` is the machine-executable version. You edit the TypeScript file, build it, and run the JavaScript file.

## API

Uses TinyURL's free API, no API key required.