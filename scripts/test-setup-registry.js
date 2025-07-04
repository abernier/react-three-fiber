#!/usr/bin/env node

/**
 * Simple test for the setup-registry.js script
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const packagesDir = path.join(__dirname, '..', 'packages')
const rootDir = path.join(__dirname, '..')

function readPackageJson(packageName) {
  const packagePath = path.join(packagesDir, packageName, 'package.json')
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'))
}

function readNpmrc() {
  const npmrcPath = path.join(rootDir, '.npmrc')
  return fs.readFileSync(npmrcPath, 'utf8')
}

function test(name, fn) {
  try {
    fn()
    console.log(`✓ ${name}`)
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`)
    process.exit(1)
  }
}

console.log('Testing setup-registry.js functionality...\n')

// Test 1: Setup for GitHub Package Registry
execSync('node scripts/setup-registry.js github', { cwd: rootDir })

test('GitHub setup: fiber package name should be @abernier-react-three/fiber', () => {
  const pkg = readPackageJson('fiber')
  if (pkg.name !== '@abernier-react-three/fiber') {
    throw new Error(`Expected @abernier-react-three/fiber, got ${pkg.name}`)
  }
})

test('GitHub setup: test-renderer package name should be @abernier-react-three/test-renderer', () => {
  const pkg = readPackageJson('test-renderer')
  if (pkg.name !== '@abernier-react-three/test-renderer') {
    throw new Error(`Expected @abernier-react-three/test-renderer, got ${pkg.name}`)
  }
})

test('GitHub setup: packages should have publishConfig for GitHub Package Registry', () => {
  const pkg = readPackageJson('fiber')
  if (!pkg.publishConfig || pkg.publishConfig.registry !== 'https://npm.pkg.github.com') {
    throw new Error('Missing or incorrect publishConfig')
  }
})

test('GitHub setup: .npmrc should contain GitHub Package Registry configuration', () => {
  const npmrc = readNpmrc()
  if (!npmrc.includes('npm.pkg.github.com') || !npmrc.includes('@abernier-react-three:registry')) {
    throw new Error('Missing GitHub Package Registry configuration in .npmrc')
  }
})

// Test 2: Restore to npm registry
execSync('node scripts/setup-registry.js npm', { cwd: rootDir })

test('npm restore: fiber package name should be @react-three/fiber', () => {
  const pkg = readPackageJson('fiber')
  if (pkg.name !== '@react-three/fiber') {
    throw new Error(`Expected @react-three/fiber, got ${pkg.name}`)
  }
})

test('npm restore: test-renderer package name should be @react-three/test-renderer', () => {
  const pkg = readPackageJson('test-renderer')
  if (pkg.name !== '@react-three/test-renderer') {
    throw new Error(`Expected @react-three/test-renderer, got ${pkg.name}`)
  }
})

test('npm restore: packages should not have publishConfig', () => {
  const pkg = readPackageJson('fiber')
  if (pkg.publishConfig) {
    throw new Error('publishConfig should be removed for npm registry')
  }
})

test('npm restore: .npmrc should not contain GitHub Package Registry configuration', () => {
  const npmrc = readNpmrc()
  if (npmrc.includes('npm.pkg.github.com') && !npmrc.includes('# This file will be populated')) {
    throw new Error('.npmrc should not contain active GitHub Package Registry configuration')
  }
})

console.log('\n✅ All tests passed! The setup-registry.js script is working correctly.')
