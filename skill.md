# Skill: Converting pmndrs/docs Sandpack to Workspace Vite App with StackBlitz Embed

## Overview

This document describes the process of converting any static Sandpack example (used in pmndrs/docs documentation) into a full-fledged Vite workspace application that can be embedded via StackBlitz iframe.

## Context

- **Before**: Static files (e.g., `index.jsx`, `styles.css`) referenced by `<Sandpack>` component in MDX documentation
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
cp -r {path/to/*-sandpack}/* /tmp/sandpack-backup/
```

### 2. Remove Old Sandpack Directory

```bash
rm -rf {path/to/*-sandpack}
```

### 3. Create New Vite App

Use `yarn create vite` to scaffold a new React application:

```bash
cd {parent-directory}
yarn create vite {new-folder-name} --template react
```

Select options:
- Framework: React
- Variant: JavaScript (or TypeScript if needed)
- Install dependencies: No (will use workspace)

### 4. Migrate Example Code

Copy the original Sandpack files into the new Vite structure:

1. **Copy main code file** from backup (e.g., `index.jsx`, `App.jsx`) to `src/main.jsx`
2. **Copy styles** from backup (e.g., `styles.css`) to `src/index.css`
3. **Adjust imports** in `src/main.jsx`:
   - Update CSS import path: `import './index.css'`
   - Ensure `createRoot` and component structure are correct for Vite entry point

**Note**: The content of these files depends on your specific Sandpack example - just copy and adapt the existing component code.

### 5. Configure Dependencies

Update `package.json` to include dependencies from your Sandpack example:

```json
{
  "dependencies": {
    "{your-workspace-package}": "*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
    // Add any other dependencies from the original Sandpack customSetup
  }
}
```

**Key points**:
- Use `"*"` for workspace packages to reference local monorepo versions
- Copy other dependencies from the Sandpack `customSetup.dependencies` configuration
- Match React/React-DOM versions with your monorepo

### 6. Add to Yarn Workspaces

Update root `package.json`:

```json
{
  "workspaces": [
    "packages/*",
    "{path/to/new-folder}"
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
# {Example Title}

<a href="https://codesandbox.io/s/github/{org}/{repo}/tree/{branch}/{path/to/folder}"><img src="https://img.shields.io/badge/codesandbox-040404?logo=codesandbox&logoColor=DBDBDB"></a>
<a href="https://stackblitz.com/github/{org}/{repo}/tree/{branch}/{path/to/folder}"><img src="https://img.shields.io/badge/stackblitz-fff?logo=Stackblitz&logoColor=1389FD"></a>

{Brief description of your example}
```

### 9. Replace Sandpack in Documentation

Update your MDX documentation file where the Sandpack component was used:

**Before:**
```jsx
<Sandpack
  customSetup={{
    dependencies: { /* ... */ },
    entry: '/index.jsx',
  }}
  folder="{sandpack-folder}"
/>
```

**After:**
```jsx
<div>
  <iframe src="https://stackblitz.com/github/{org}/{repo}/tree/{branch}/{path/to/folder}?embed=1" 
    className="w-full h-60 rounded-lg"
  />
  <p className="mt-1 text-xs text-on-surface-variant">This is an embed iframe of https://stackblitz.com/github/{org}/{repo}/tree/{branch}/{path/to/folder}</p>
</div>
```

## Verification

Test the workspace app locally:

```bash
yarn workspace {folder-name} dev
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
- Preserve all functionality from the original Sandpack example

## Files Modified

- `package.json` (root) - Add workspace
- Documentation MDX file - Replace Sandpack with iframe
- `{path/to/folder}/` - New Vite app directory

## Common Patterns

- Most Sandpack examples have an entry file (`index.jsx`, `App.jsx`) → becomes `src/main.jsx`
- Styles file (`styles.css`, `index.css`) → becomes `src/index.css`
- Dependencies from Sandpack `customSetup.dependencies` → go into Vite app's `package.json`
- Workspace packages should use `"*"` version to reference local builds
