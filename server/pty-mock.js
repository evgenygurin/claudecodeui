// Mock for node-pty to avoid compilation issues
// This provides a basic terminal emulation without native dependencies

import { EventEmitter } from 'events';
import { spawn } from 'child_process';

class PtyMock extends EventEmitter {
  constructor(shell, args, options) {
    super();
    this.shell = shell;
    this.args = args;
    this.options = options;
    this.process = null;
    this._cols = options.cols || 80;
    this._rows = options.rows || 24;

    // Spawn the actual process
    this.process = spawn(shell, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      shell: true,
    });

    // Forward output
    if (this.process.stdout) {
      this.process.stdout.on('data', data => {
        this.emit('data', data.toString());
      });
    }

    if (this.process.stderr) {
      this.process.stderr.on('data', data => {
        this.emit('data', data.toString());
      });
    }

    // Handle process exit
    this.process.on('exit', (code, signal) => {
      this.emit('exit', code, signal);
    });

    this.process.on('error', err => {
      this.emit('error', err);
    });
  }

  write(data) {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(data);
    }
  }

  resize(cols, rows) {
    this._cols = cols;
    this._rows = rows;
    // In a real implementation, this would send SIGWINCH to the process
  }

  kill(signal) {
    if (this.process) {
      this.process.kill(signal);
    }
  }

  destroy() {
    this.kill();
  }

  get pid() {
    return this.process ? this.process.pid : null;
  }
}

export function spawnPty(shell, args, options) {
  return new PtyMock(shell, args, options);
}

export default {
  spawn: spawnPty,
};
