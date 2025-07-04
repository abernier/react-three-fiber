# GitHub Package Registry Publishing

This repository is configured to support publishing packages to both npm and GitHub Package Registry (GPR). This enables forks to publish their own versions of the packages that anyone can consume.

## How it works

### For the original repository (pmndrs/react-three-fiber)

The packages are published as:

- `@react-three/fiber`
- `@react-three/test-renderer`
- `@react-three/eslint-plugin`

### For forks (e.g., abernier/react-three-fiber)

The packages are automatically renamed and published as:

- `@abernier/fiber`
- `@abernier/test-renderer`
- `@abernier/eslint-plugin`

This allows each fork to maintain its own package namespace without conflicts.

## Publishing Workflows

### Automated Publishing (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically publishes to GitHub Package Registry when changes are pushed to the master branch. The workflow:

1. Detects the repository owner automatically
2. Configures package names for the appropriate scope
3. Publishes to GitHub Package Registry with proper authentication

### Manual Publishing

You can also publish manually using the provided scripts:

#### Publish to GitHub Package Registry

```bash
yarn release:github
```

#### Publish to npm registry (original packages only)

```bash
yarn release:npm
```

## Setup for Forks

To set up publishing for your fork:

1. **Fork the repository** - The scripts will automatically detect your GitHub username
2. **Enable GitHub Package Registry** - Make sure packages are enabled in your repository settings
3. **Create a Personal Access Token** with `write:packages` permission
4. **Run the publishing workflow** - Either manually or through GitHub Actions

## Configuration Files

### .npmrc

Contains registry configuration for GitHub Package Registry. Uses environment variables for authentication and repository owner detection.

### scripts/setup-registry.js

Helper script that:

- Automatically detects the repository owner
- Updates package names for forks (`@owner/package-name`)
- Configures publishConfig for the appropriate registry
- Can restore original names for npm publishing

### .github/workflows/release.yml

GitHub Actions workflow for automated publishing to GPR.

## Using Published Packages

### From GitHub Package Registry

First, configure npm to use GitHub Package Registry for the scoped packages:

```bash
# Add to your .npmrc file
@your-username:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @your-username/fiber
npm install @your-username/test-renderer
```

### Authentication for Private Packages

If packages are published privately, you'll need authentication:

```bash
npm login --scope=@your-username --registry=https://npm.pkg.github.com
```

Or add to your .npmrc:

```
//npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN
```

## Benefits

1. **Fork Independence** - Each fork can publish and maintain its own packages
2. **No Conflicts** - Different forks use different package scopes
3. **Easy Distribution** - Published packages can be consumed by anyone
4. **Automated** - GitHub Actions handle the publishing process
5. **Flexible** - Supports both GitHub Package Registry and npm registry

## Troubleshooting

### Package not found

Make sure you've configured npm to use GitHub Package Registry for the appropriate scope.

### Authentication errors

Ensure you have a valid Personal Access Token with `read:packages` and `write:packages` permissions.

### Publishing fails

Check that packages are enabled in your repository settings and that your token has the correct permissions.
