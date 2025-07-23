#!/usr/bin/env node

// Simple test script to verify the StarRocks MCP Server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing StarRocks MCP Server...');

// Test the server by running it
const serverProcess = spawn('node', [join(__dirname, 'dist/index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
});

serverProcess.stdout.on('data', (data) => {
    console.log('Server output:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
});

serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});

// Kill the server after 5 seconds
setTimeout(() => {
    console.log('Terminating server...');
    serverProcess.kill('SIGINT');
}, 5000);