# Skill: Converting pmndrs/docs Sandpack to Workspace Vite App with StackBlitz Embed

## Overview

This document describes the process of converting a static Sandpack example (used in pmndrs/docs documentation) into a full-fledged Vite workspace application that can be embedded via StackBlitz iframe.

## Context

- **Before**: Static files (`index.jsx`, `styles.css`) referenced by `<Sandpack>` component in MDX documentation
- **After**: Full Vite app integrated as yarn workspace, embedded via StackBlitz iframe in documentation

## Prerequisites

- Yarn workspaces setup in repository
- Existing Sandpack example files to migrate
- Documentation using pmndrs/docs framework

## Step-by-Step Process

### 1. Backup Original Content

Preserve the existing Sandpack files before removing them:

```bash
mkdir -p /tmp/sandpack-backup
cp -r {path/to/example-folder}/* /tmp/sandpack-backup/
```

### 2. Remove Old Sandpack Directory

```bash
rm -rf {path/to/example-folder}
```

### 3. Create New Vite App

Use `yarn create vite` to scaffold a new React application:

```bash
cd {parent-directory}
yarn create vite {example-folder} --template react
```

Select options:
- Framework: React
- Variant: JavaScript (or TypeScript if needed)
- Install dependencies: No (will use workspace)

### 4. Migrate Example Code

Move the original example code into the new Vite structure.

**Main entry (`src/main.jsx`):**
```jsx
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import './index.css'

// Your component code here
function Box(props) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((_state, delta) => (meshRef.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

createRoot(document.getElementById('root')).render(
  <Canvas>
    <ambientLight intensity={Math.PI / 2} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </Canvas>,
)
```

**Styles (`src/index.css`):**
```css
html,
body,
#root {
  height: 100%;
  margin: unset;
}
```

### 5. Configure Dependencies

Update `package.json` to use local workspace packages:

```json
{
  "dependencies": {
    "@react-three/fiber": "*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "three": "^0.172.0"
  }
}
```

Using `"*"` for `@react-three/fiber` ensures it uses the local monorepo version.

### 6. Add to Yarn Workspaces

Update root `package.json`:

```json
{
  "workspaces": [
    "packages/*",
    "example",
    "{path/to/example-folder}"
  ]
}
```

### 7. Install Dependencies

```bash
yarn install
```

This installs dependencies for all workspaces, including the new example.

### 8. Create README with Badges

Create a minimal `README.md` in the example directory:

```markdown
# Example Title

<a href="https://codesandbox.io/s/github/{org}/{repo}/tree/{branch}/{path/to/example-folder}"><img src="https://img.shields.io/badge/codesandbox-040404?logo=codesandbox&logoColor=DBDBDB"></a>
<a href="https://stackblitz.com/github/{org}/{repo}/tree/{branch}/{path/to/example-folder}"><img src="https://img.shields.io/badge/stackblitz-fff?logo=Stackblitz&logoColor=1389FD"></a>

A brief description of your example.
```

### 9. Replace Sandpack in Documentation

Update your MDX documentation file:

**Before:**
```jsx
<Sandpack
  customSetup={{
    dependencies: {
      'react': 'latest',
      'react-dom': 'latest',
      'three': 'latest',
      '@react-three/fiber': 'latest'
    },
    entry: '/index.jsx',
  }}
  folder="{example-folder}"
/>
```

**After:**
```jsx
<div>
  <iframe src="https://stackblitz.com/github/{org}/{repo}/tree/{branch}/{path/to/example-folder}?embed=1" 
    className="w-full h-60 rounded-lg"
  />
  <p className="mt-1 text-xs text-on-surface-variant">This is an embed iframe of https://stackblitz.com/github/{org}/{repo}/tree/{branch}/{path/to/example-folder}</p>
</div>
```

## Verification

Test the workspace app locally:

```bash
yarn workspace {example-folder} dev
```

The app should run at `http://localhost:5173/` and display your example.

## Benefits

1. **Full Development Environment**: Hot-reload, proper build tooling, full debugging capabilities
2. **Workspace Integration**: Dependencies managed through monorepo, uses local library versions
3. **Interactive Documentation**: Users can interact with live examples via StackBlitz
4. **Easy Contribution**: Contributors can modify examples like any other code in the repository
5. **Version Control**: Example code is properly version controlled with meaningful commits

## Key Considerations

- Use `"*"` for workspace package versions to reference local versions
- Mark intentionally unused parameters with underscore prefix (e.g., `_state`)
- Keep README minimal but informative
- Include badges for online IDE access (CodeSandbox, StackBlitz)
- Update StackBlitz URL to reference correct branch during PR review

## Files Modified

- `package.json` (root) - Add workspace
- Documentation MDX file - Replace Sandpack with iframe
- `{path/to/example-folder}/` - New Vite app directory

## Example Result

![Working Example](https://github.com/user-attachments/assets/3504a51c-3f81-4509-89c8-cb60fe8a4497)

Interactive 3D boxes that rotate continuously, turn hotpink on hover, and scale up when clicked.
