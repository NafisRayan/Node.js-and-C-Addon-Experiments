# Image Converter Addon

A full-stack Node.js application with a C++ addon for converting images to numeric representations and back.

## Features

- Upload images and convert to pixel arrays (RGB values)
- Generate images from numeric arrays
- Clean and responsive web interface using Tailwind CSS
- Download generated images

## Setup

1. Install dependencies: `npm install`
2. Build the C++ addon: `npm run build` (requires Visual Studio with C++ tools on Windows)
3. Start the server: `npm start`
4. Open http://localhost:3000 in your browser

## Requirements

- Node.js
- npm
- Visual Studio with "Desktop development with C++" workload (for building the addon on Windows)

## API Endpoints

- `POST /convert`: Upload an image file to get its pixel array
- `POST /generate`: Send a JSON with `numbers`, `width`, `height` to generate an image

## Deployment

This application can be deployed to platforms like Render, Railway, or Vercel. For Vercel, you may need to configure it as a serverless function or use a static build.

## Project Structure

- `src/addon.cc`: C++ addon code using N-API and stb_image
- `index.js`: Express server
- `public/index.html`: Frontend interface
- `binding.gyp`: Build configuration for the addon