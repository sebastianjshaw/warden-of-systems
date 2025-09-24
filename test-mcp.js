#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Warden of Systems MCP Server...\n');

// Test if the server starts without errors
const server = spawn('node', ['mcp-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

server.on('close', (code) => {
  console.log(`✅ Server test completed with exit code: ${code}`);
  
  if (errorOutput.includes('Warden of Systems MCP server running')) {
    console.log('✅ Server started successfully!');
  } else {
    console.log('❌ Server failed to start properly');
    console.log('Error output:', errorOutput);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Add the MCP configuration to Cursor');
  console.log('2. Restart Cursor');
  console.log('3. Try asking: "Get chapter 1 from Warden of Systems"');
  console.log('\n🎉 Your fantasy world is now accessible to AI assistants!');
});

// Send a test request
setTimeout(() => {
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };
  
  server.stdin.write(JSON.stringify(testRequest) + '\n');
  
  // Close the server after test
  setTimeout(() => {
    server.kill();
  }, 2000);
}, 1000);
