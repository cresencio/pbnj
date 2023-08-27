#!/usr/bin/env node

// Importing required modules
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const { exec } = require('child_process');

// Extracting command line arguments
const args = process.argv.slice(2);
let projectName = args.find(arg => arg.startsWith('--name='))?.split('=')[1];

// Checking if project name is provided as a command line argument
if (!projectName) {
  // If project name is not provided, prompt the user to enter a project name
  prompt.start();
  prompt.get([{
    name: 'name',
    description: 'Enter a project name:',
    required: true
  }], (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    // Call the createProject function with the entered project name
    createProject(result.name);
  });
} else {
  // If project name is provided as a command line argument, call the createProject function with the provided project name
  createProject(projectName);
}

// Function to create a new project
function createProject(name) {
  // Generating the project path by joining the current working directory and the project name
  const projectPath = path.join(process.cwd(), name);

  try {
    // Checking if the project directory already exists
    if (fs.existsSync(projectPath)) {
      console.error(`Directory ${projectPath} already exists.`);
      return;
    }

    // Cloning a git repository into the project path
    console.log(`Cloning into ${name}...`);
    exec(`git clone --depth 1 https://github.com/cresencio/pbnj.git ${projectPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`An error occurred while cloning the project: ${error}`);
        return;
      }

      // Removing the .git directory from the cloned repository
      exec(`rm -rf ${path.join(projectPath, '.git')}`, (err) => {
        if (err) {
          console.error(`An error occurred while removing the .git directory: ${err}`);
          return;
        }

        // Success message after project creation
        console.log(`Project created: cd into ${name} and run npm install && npm run start`);
      });
    });

  } catch (err) {
    console.error('An error occurred while creating the project:', err);
  }
}
