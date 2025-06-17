const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const backendPath = path.join(__dirname, 'backend');
const frontendPath = path.join(__dirname, 'frontend');

// Check if paths exist
if (!fs.existsSync(backendPath)) {
  console.error('Backend directory not found!');
  process.exit(1);
}

if (!fs.existsSync(frontendPath)) {
  console.error('Frontend directory not found!');
  process.exit(1);
}

// Function to start a process
function startProcess(name, command, args, cwd) {
  console.log(`Starting ${name}...`);
  
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
  });

  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });

  proc.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });

  return proc;
}

// Start backend server
const backend = startProcess('Backend', 'npm', ['run', 'dev'], backendPath);

// Start frontend server with a delay to ensure backend starts first
setTimeout(() => {
  const frontend = startProcess('Frontend', 'npm', ['start'], frontendPath);

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Stopping all processes...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}, 2000);

console.log('Development servers starting...');
console.log('Press Ctrl+C to stop all servers.');
