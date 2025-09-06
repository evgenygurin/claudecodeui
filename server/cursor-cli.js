import { spawn } from 'child_process';
import crossSpawn from 'cross-spawn';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Use cross-spawn on Windows for better command execution
const spawnFunction = process.platform === 'win32' ? crossSpawn : spawn;

let activeCursorProcesses = new Map(); // Track active processes by session ID

async function spawnCursor(command, options = {}, ws) {
  // Cursor CLI chat interface is not available in current Cursor CLI version
  // The current Cursor CLI (1.5.11) is just the VS Code editor, not a chat interface
  console.log('⚠️  Cursor CLI chat interface is not available in current Cursor CLI version');
  console.log('⚠️  Current Cursor CLI (1.5.11) is just the VS Code editor, not a chat interface');
  console.log('⚠️  Please use Claude CLI or Codegen for chat functionality');
  
  // Send error message to frontend
  if (ws) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Cursor CLI chat interface is not available. Please use Claude CLI or Codegen for chat functionality.',
      timestamp: new Date().toISOString()
    }));
  }
  
  return Promise.resolve();
}

function abortCursorSession(sessionId) {
  const process = activeCursorProcesses.get(sessionId);
  if (process) {
    console.log(`🛑 Aborting Cursor session: ${sessionId}`);
    process.kill('SIGTERM');
    activeCursorProcesses.delete(sessionId);
    return true;
  }
  return false;
}

export {
  spawnCursor,
  abortCursorSession
};