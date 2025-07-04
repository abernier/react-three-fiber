#!/usr/bin/env node

/**
 * Helper script to set up dynamic package publishing for GitHub Package Registry
 * This enables forks to publish to their own GitHub Package Registry
 */

const fs = require('fs')
const path = require('path')

// Get repository owner from environment or git remote
function getRepositoryOwner() {
  const githubRepo = process.env.GITHUB_REPOSITORY
  if (githubRepo) {
    return githubRepo.split('/')[0]
  }

  // Fallback: try to get from git remote
  const { execSync } = require('child_process')
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
    const match = remote.match(/github\.com[:/]([^/]+)\//)
    return match ? match[1] : null
  } catch (e) {
    return null
  }
}

// Update .npmrc for GitHub Package Registry
function updateNpmrcForGithub(repositoryOwner) {
  const npmrcPath = path.join(__dirname, '..', '.npmrc')
  const githubNpmrc = `# GitHub Package Registry configuration
# Generated automatically by scripts/setup-registry.js

@react-three:registry=https://npm.pkg.github.com
${repositoryOwner ? `@${repositoryOwner}-react-three:registry=https://npm.pkg.github.com` : ''}
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}`

  fs.writeFileSync(npmrcPath, githubNpmrc)
  console.log('Updated .npmrc for GitHub Package Registry')
}

// Restore .npmrc for npm registry
function restoreNpmrcForNpm() {
  const npmrcPath = path.join(__dirname, '..', '.npmrc')
  const npmNpmrc = `# GitHub Package Registry configuration
# This file will be populated dynamically by scripts/setup-registry.js when needed`

  fs.writeFileSync(npmrcPath, npmNpmrc)
  console.log('Restored .npmrc for npm registry')
}
function updatePackageForGithubRegistry(packagePath, repositoryOwner) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  if (!fs.existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Skip if it's a private package or doesn't have a scoped name
  if (packageJson.private || !packageJson.name.startsWith('@')) return

  // Update package name to match repository owner for forks
  if (repositoryOwner && repositoryOwner !== 'pmndrs') {
    const [, packageSuffix] = packageJson.name.split('/')
    packageJson.name = `@${repositoryOwner}-react-three/${packageSuffix}`
  }

  // Ensure publishConfig points to GitHub Package Registry
  packageJson.publishConfig = {
    registry: 'https://npm.pkg.github.com',
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`Updated ${packageJson.name} for GitHub Package Registry`)
}

// Restore original package.json files for npm registry publishing
function restorePackageForNpmRegistry(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  if (!fs.existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Skip if it's a private package
  if (packageJson.private) return

  // Restore original scope if this is a fork
  if (packageJson.name.includes('/')) {
    const [currentScope, packageSuffix] = packageJson.name.split('/')
    if (currentScope !== '@react-three') {
      packageJson.name = `@react-three/${packageSuffix}`
    }
  }

  // Remove publishConfig to use default npm registry
  delete packageJson.publishConfig

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`Restored ${packageJson.name} for npm registry`)
}

// Main function
function main() {
  const action = process.argv[2]
  const repositoryOwner = getRepositoryOwner()

  console.log(`Repository owner: ${repositoryOwner || 'unknown'}`)

  const packagesDir = path.join(__dirname, '..', 'packages')
  const packages = fs.readdirSync(packagesDir).filter((pkg) => fs.statSync(path.join(packagesDir, pkg)).isDirectory())

  if (action === 'github') {
    console.log('Configuring packages for GitHub Package Registry...')
    updateNpmrcForGithub(repositoryOwner)
    packages.forEach((pkg) => {
      updatePackageForGithubRegistry(path.join(packagesDir, pkg), repositoryOwner)
    })
  } else if (action === 'npm') {
    console.log('Configuring packages for npm registry...')
    restoreNpmrcForNpm()
    packages.forEach((pkg) => {
      restorePackageForNpmRegistry(path.join(packagesDir, pkg))
    })
  } else {
    console.log('Usage: node scripts/setup-registry.js [github|npm]')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = {
  updatePackageForGithubRegistry,
  restorePackageForNpmRegistry,
  updateNpmrcForGithub,
  restoreNpmrcForNpm,
}
