# Image Converter Addon

A high-performance full-stack Node.js application featuring a native C++ addon for bidirectional image conversion between visual formats and numeric pixel arrays. This project demonstrates advanced integration of Node.js with C++ using N-API, providing efficient image processing capabilities.

## 🚀 Features

- **Image to Numbers Conversion**: Upload any image and convert it to a flat array of RGB pixel values
- **Numbers to Image Generation**: Reconstruct images from numeric arrays with specified dimensions
- **Native C++ Performance**: Leverages stb_image library for fast image processing
- **Memory and File Support**: Generate images from in-memory arrays or loaded JSON files
- **Modern Web Interface**: Responsive UI built with Tailwind CSS and Lucide icons
- **Drag & Drop Upload**: Intuitive file selection with drag-and-drop support
- **Download Capabilities**: Export generated images and numeric data
- **Real-time Feedback**: Loading states and progress indicators
- **Error Handling**: Comprehensive error messages and validation

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 📋 Prerequisites

### System Requirements

- **Node.js**: Version 18.0.0 or higher (tested with 22.20.0)
- **npm**: Latest version (comes with Node.js)
- **Python**: Version 3.8+ (specifically Python 3.11 recommended for node-gyp compatibility)
- **Visual Studio Build Tools** (Windows only): Required for compiling C++ addon
  - Install "Desktop development with C++" workload
  - Ensure MSVC compiler tools are available

### Windows Setup

1. **Install Visual Studio Build Tools**:
   ```bash
   # Download and install Visual Studio Build Tools from:
   # https://visualstudio.microsoft.com/visual-cpp-build-tools/
   # Select "Desktop development with C++" workload
   ```

2. **Install Python 3.11**:
   ```bash
   # Download from: https://www.python.org/downloads/
   # Or use winget: winget install Python.Python.3.11
   ```

3. **Verify installations**:
   ```bash
   node --version  # Should show v18.0.0+
   npm --version   # Should show latest
   python --version  # Should show Python 3.11.x
   ```

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Node.js C++ Addon (image convertion)"
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express`: Web server framework
- `multer`: File upload handling
- `node-addon-api`: N-API headers for C++ addon
- `node-gyp`: Build tool for native addons

### 3. Build the C++ Addon

```bash
# Set Python path (if not automatically detected)
npm config set python "C:\Users\<username>\AppData\Local\Programs\Python\Python311\python.exe"

# Build the addon
npm run build
```

**Expected Output:**
```
gyp info it worked if it ends with ok
gyp info using node-gyp@9.4.1
gyp info using node@22.20.0 | win32 | x64
...
gyp info ok
```

### 4. Start the Application

```bash
npm start
```

The server will start on `http://localhost:3000`

## 🎯 Usage

### Web Interface

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Convert Image to Numbers**:
   - Click the "Upload Image" area or drag & drop an image file
   - Click "Convert to Numbers"
   - View the generated pixel array and dimensions
   - Download the numbers as JSON

3. **Generate Image from Numbers**:
   - **From Memory**: Use numbers from a recently converted image
   - **From File**: Load a previously saved JSON file with numbers array
   - Set width and height (auto-filled for memory generation)
   - Click "Generate" and download the resulting image

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- GIF (.gif)
- And other formats supported by stb_image

### File Format for Numbers

JSON format for saved number arrays:
```json
{
  "numbers": [255, 0, 0, 0, 255, 0, ...],
  "width": 800,
  "height": 600
}
```

## 📚 API Documentation

### POST /convert

Convert an uploaded image to a numeric pixel array.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Response:**
```json
{
  "numbers": [255, 0, 0, 0, 255, 0, ...],
  "width": 800,
  "height": 600
}
```

**Example using curl:**
```bash
curl -X POST -F "image=@image.jpg" http://localhost:3000/convert
```

### POST /generate

Generate an image from a numeric array.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
```json
{
  "numbers": [255, 0, 0, 0, 255, 0, ...],
  "width": 800,
  "height": 600
}
```

**Response:**
- Content-Type: `image/png`
- Body: PNG image binary data

**Example using curl:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"numbers":[255,0,0,0,255,0],"width":2,"height":1}' \
  http://localhost:3000/generate \
  --output generated.png
```

## 🏗️ Project Structure

```
├── src/
│   └── addon.cc              # C++ addon implementation
├── public/
│   └── index.html            # Frontend interface
├── binding.gyp               # Build configuration
├── index.js                  # Express server
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── .github/
    └── copilot-instructions.md
```

### Key Files Explained

- **`src/addon.cc`**: Contains two N-API functions:
  - `imageToNumbers`: Loads image using stb_image, extracts RGB values
  - `numbersToImage`: Creates PNG from RGB array using stb_image_write

- **`index.js`**: Express server with:
  - File upload handling via multer
  - JSON payload size limits (50MB)
  - Error handling and CORS support

- **`public/index.html`**: Modern SPA with:
  - Drag-and-drop file upload
  - Real-time image preview
  - Responsive design with Tailwind CSS

## 🏛️ Architecture

### C++ Addon Layer
- Uses **N-API** for thread-safe Node.js integration
- **stb_image** for image loading/decoding
- **stb_image_write** for PNG generation
- Memory-efficient processing of large images

### Node.js Server Layer
- **Express.js** for HTTP routing
- **Multer** for multipart form handling
- **Body-parser** for JSON payloads
- Static file serving for frontend assets

### Frontend Layer
- **Vanilla JavaScript** with modern ES6+ features
- **Tailwind CSS** for styling
- **Lucide icons** for UI elements
- **Fetch API** for AJAX requests

### Data Flow

1. **Image Upload** → Multer → C++ addon (imageToNumbers) → RGB array
2. **Number Array** → Express → C++ addon (numbersToImage) → PNG blob
3. **Frontend** ↔ **Backend** via RESTful API calls

## 🔧 Troubleshooting

### Build Issues

**"No module named 'distutils'"**
- Ensure Python 3.11 is installed and set as npm python config
- Run: `npm config set python "C:\path\to\python311\python.exe"`

**"MSBuild not found"**
- Install Visual Studio Build Tools with C++ workload
- Restart command prompt after installation

**"node-gyp rebuild failed"**
- Clear node-gyp cache: `npm config delete python && npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Runtime Issues

**"Server error" on convert/generate**
- Check server logs in terminal
- Ensure image file is valid and not corrupted
- Verify array length matches width × height × 3

**Large images fail to process**
- Increase Node.js memory limit: `node --max-old-space-size=4096 index.js`
- Check available system RAM

**CORS errors**
- Ensure requests are made to the same origin (localhost:3000)

### Performance Tips

- For large images (>10MB), consider increasing server timeout
- Use PNG format for best quality/size ratio
- Close browser tabs when not in use to free memory

## 🚀 Deployment

### Local Development
```bash
npm start  # Runs on http://localhost:3000
```

### Production Deployment

**Environment Variables:**
```bash
PORT=3000
NODE_ENV=production
```

**Build Process:**
```bash
npm install --production
npm run build
npm start
```

### Platform-Specific Notes

**Render/Vercel:**
- May require custom build commands
- Ensure Python and build tools are available in deployment environment

**Docker:**
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages
5. Push to your fork and create a Pull Request

### Development Setup

```bash
# Install dev dependencies
npm install

# Run in development mode with auto-restart
npm run dev  # (if nodemon is added)

# Run tests (when implemented)
npm test
```