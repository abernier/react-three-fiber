# GitHub Package Registry Demo

This demonstrates how the GitHub Package Registry setup enables portable package publishing for forks.

## Example: Installing packages from abernier's fork

### For a consumer wanting to use abernier's version:

1. **Configure npm to use GitHub Package Registry for abernier's packages:**

   ```bash
   # Add to ~/.npmrc or project .npmrc
   @abernier-react-three:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

2. **Install the forked packages:**

   ```bash
   npm install @abernier-react-three/fiber
   npm install @abernier-react-three/test-renderer
   npm install @abernier-react-three/eslint-plugin
   ```

3. **Use in your project (same API, different source):**
   ```jsx
   import { Canvas } from '@abernier-react-three/fiber'
   // Works exactly like @react-three/fiber but from abernier's fork
   ```

## Example: Setting up your own fork

### As a fork maintainer:

1. **Fork the repository** to your GitHub account (e.g., `yourname/react-three-fiber`)

2. **Publish your packages:**

   ```bash
   # Your packages will be published as @yourname-react-three/fiber, @yourname-react-three/test-renderer, etc.
   yarn changeset:add
   yarn vers
   yarn release:github
   ```

3. **Enable GitHub Packages** in your repository settings

4. **Your packages are now available to everyone:**
   ```bash
   npm install @yourname-react-three/fiber
   ```

## Benefits for the Ecosystem

- **No Conflicts**: Each fork uses its own scope (`@username-react-three/`)
- **Easy Distribution**: Anyone can publish and consume fork-specific packages
- **Backward Compatible**: Original packages still work as `@react-three/fiber`
- **Automatic**: GitHub Actions handle everything after initial setup
- **Transparent**: Same API, different distribution channel

## Real-world Use Cases

1. **Experimental Features**: Publish packages with experimental features before they're merged upstream
2. **Bug Fixes**: Quickly distribute critical bug fixes without waiting for upstream releases
3. **Custom Modifications**: Share modified versions tailored for specific use cases
4. **Version Pinning**: Maintain specific versions for enterprise or stability requirements

This approach makes the entire react-three-fiber ecosystem more distributed and resilient!
