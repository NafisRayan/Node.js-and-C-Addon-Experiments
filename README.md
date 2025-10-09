# Learning Repository

A comprehensive collection of Node.js learning projects demonstrating various concepts, from asynchronous programming and web development to native C++ addons and image processing.

## 📚 Repository Overview

This repository serves as a learning hub for Node.js development, containing three distinct projects that showcase different aspects of JavaScript and Node.js ecosystem:

1. **[Event Loop Visualizer](./Event%20Loop,%20Web%20APIs,%20(Micro)task%20Queue/)** - Interactive visualization of Node.js event loop mechanics
2. **[Express Chat App](./initial/)** - Simple real-time chat application using Express.js
3. **[Image Converter Addon](./Node.js%20C%20Addon%20(image%20convertion)/)** - High-performance image processing with native C++ addon

Each project includes detailed documentation, setup instructions, and comprehensive explanations of the underlying concepts.

## 🎯 Learning Objectives

This repository covers:
- **Asynchronous Programming**: Event loops, callbacks, promises, and microtasks
- **Web Development**: REST APIs, middleware, static file serving
- **Full-Stack Applications**: Frontend-backend integration
- **Native Addons**: C++ integration with Node.js using N-API
- **Image Processing**: Low-level pixel manipulation and format conversion
- **Performance Optimization**: Native code for computationally intensive tasks

## 📁 Project Structure

```
Learning/
├── Event Loop, Web APIs, (Micro)task Queue/
│   ├── server.js                 # Express server for visualization
│   ├── public/
│   │   ├── index.html           # Interactive UI
│   │   └── script.js            # Event loop simulation
│   ├── test/
│   │   └── server.test.js       # Server tests
│   ├── package.json
│   └── README.md                # Detailed project docs
│
├── initial/
│   ├── app.js                   # Chat server
│   ├── messages.json            # JSON database
│   ├── public/
│   │   ├── index.html          # Chat interface
│   │   ├── style.css           # Styling
│   │   └── app.js              # Frontend logic
│   ├── package.json
│   └── README.md               # Detailed project docs
│
└── Node.js C++ Addon (image convertion)/
    ├── index.js                 # Express server
    ├── src/
    │   └── addon.cc            # C++ addon source
    ├── public/
    │   └── index.html          # Image converter UI
    ├── binding.gyp             # Build configuration
    ├── TECHNICAL_DOCUMENTATION.md # In-depth technical docs
    ├── package.json
    └── README.md               # Detailed project docs
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Python 3.11** (for C++ addon building on Windows)
- **Visual Studio Build Tools** (for C++ compilation on Windows)

### Setup All Projects

```bash
# Clone the repository
git clone https://github.com/NafisRayan/Learning.git
cd Learning

# Each project has its own setup - see individual READMEs
```

## 📖 Projects in Detail

### 1. Event Loop Visualizer

**Location**: [`Event Loop, Web APIs, (Micro)task Queue/`](./Event%20Loop,%20Web%20APIs,%20(Micro)task%20Queue/)

**What it teaches**:
- Node.js event loop architecture
- Task queues (macrotasks vs microtasks)
- Asynchronous execution order
- Visual debugging of async code

**Key Features**:
- Real-time event loop simulation
- Interactive task addition (sync, async, microtasks)
- Visual queue management
- Console logging with timestamps
- Educational explanations

**Tech Stack**: Node.js, Express.js, Vanilla JavaScript, Tailwind CSS

**Setup**:
```bash
cd "Event Loop, Web APIs, (Micro)task Queue"
npm install
npm start
# Visit http://localhost:3000
```

### 2. Express Chat App

**Location**: [`initial/`](./initial/)

**What it teaches**:
- RESTful API design
- Express.js middleware
- JSON file-based database
- Frontend-backend communication
- Real-time UI updates

**Key Features**:
- User messaging system
- Auto-refreshing chat interface
- JSON data persistence
- Input validation
- Responsive design

**Tech Stack**: Node.js, Express.js, Vanilla JavaScript, HTML5, CSS3

**Setup**:
```bash
cd initial
npm install
npm start
# Visit http://localhost:3000
```

### 3. Image Converter Addon

**Location**: [`Node.js C++ Addon (image convertion)/`](./Node.js%20C%20Addon%20(image%20convertion)/)

**What it teaches**:
- Native C++ addons with N-API
- Cross-language performance optimization
- Image processing algorithms
- Memory management in native code
- Build systems (node-gyp)

**Key Features**:
- Bidirectional image conversion
- High-performance C++ processing
- Drag-and-drop file upload
- JSON data export/import
- Real-time image generation

**Tech Stack**: Node.js, C++, N-API, stb_image, Express.js, Tailwind CSS

**Setup** (Windows):
```bash
cd "Node.js C++ Addon (image convertion)"
npm install
npm run build
npm start
# Visit http://localhost:3000
```

## 🛠️ Development Environment

### Recommended Tools

- **VS Code** with extensions:
  - JavaScript/TypeScript support
  - C/C++ extension (for addon development)
  - Node.js debugger
- **Git** for version control
- **Postman** for API testing

### Testing

Each project includes different testing approaches:
- **Event Loop**: Jest for server testing
- **Chat App**: Manual testing (could be extended)
- **Image Converter**: Manual testing with various image formats

## 📚 Learning Path

Suggested order to explore the projects:

1. **Start with Express Chat App** - Learn basic Node.js web development
2. **Move to Event Loop Visualizer** - Understand asynchronous programming deeply
3. **Advance to Image Converter Addon** - Explore native performance optimization

Each project builds upon the previous concepts while introducing new challenges.
