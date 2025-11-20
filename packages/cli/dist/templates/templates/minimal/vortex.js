#!/usr/bin/env node

// vortex.js: Proxy to next.js CLI but with .vtx transpile support and branding

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find next binary
const nextBin = require.resolve('next/dist/bin/next');

// Patch process title for branding
process.title = 'vortex';

// Optionally: add .vtx transpile hook here (if you have a transpiler)
// Example: require('./.vortex-transpiler')();

// Proxy all args to next
const args = process.argv.slice(2);
const child = spawn('node', [nextBin, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VORTEX_BRAND: '1',
    FORCE_COLOR: '1',
  },
});

child.on('exit', code => process.exit(code));
