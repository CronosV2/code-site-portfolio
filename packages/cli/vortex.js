#!/usr/bin/env node

// Wrapper to run Vortex CLI from local installation
const path = require('path');
const { spawn } = require('child_process');

const cliPath = path.join(__dirname, 'index.js');
const args = process.argv.slice(2);

const child = spawn('node', [cliPath, ...args], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

child.on('exit', (code) => {
  process.exit(code);
});
