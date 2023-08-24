#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const { exec } = require('child_process');

const args = process.argv.slice(2);
let projectName = args.find(arg => arg.startsWith('--name='))?.split('=')[1];

if (!projectName) {
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

    createProject(result.name);
  });
} else {
  createProject(projectName);
}

function createProject(name) {
  const projectPath = path.join(process.cwd(), name);

  try {
    if (fs.existsSync(projectPath)) {
      console.error(`Directory ${projectPath} already exists.`);
      return;
    }

    console.log(`Cloning into ${name}...`);
    exec(`git clone --depth 1 https://github.com/cresencio/pbnj.git ${projectPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`An error occurred while cloning the project: ${error}`);
        return;
      }

      // Removing .git directory
      exec(`rm -rf ${path.join(projectPath, '.git')}`, (err) => {
        if (err) {
          console.error(`An error occurred while removing the .git directory: ${err}`);
          return;
        }

        console.log(`Project created: cd into ${name} and run npm install && npm run start`);
      });
    });

  } catch (err) {
    console.error('An error occurred while creating the project:', err);
  }
}
