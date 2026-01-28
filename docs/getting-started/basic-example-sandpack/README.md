# Basic React Three Fiber Example

This is a basic example demonstrating React Three Fiber in a Vite development environment.

## What It Does

This example showcases:

- Two rotating 3D boxes rendered with React Three Fiber
- Interactive hover effects (boxes turn hotpink on hover)
- Click interactions (boxes scale up when clicked)
- Basic lighting setup with ambient, spot, and point lights

## Running the Example

From the repository root, run:

```bash
# Install dependencies (if not already done)
yarn install

# Start the dev server
yarn workspace basic-example-sandpack dev
```

Or from this directory:

```bash
yarn dev
```

The example will be available at `http://localhost:5173/`

## Tech Stack

- **React Three Fiber (v9)**: React renderer for Three.js
- **Three.js**: 3D graphics library
- **Vite**: Build tool and dev server
- **React 19**: UI library
