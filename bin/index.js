#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');

const args = process.argv.slice(2);
let projectName = args.find(arg => arg.startsWith('--name='))?.split('=')[1];

if (!projectName) {
  prompt.start();
  prompt.get([{
    name: 'name',
    description: 'Enter a project name',
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

    fs.mkdirSync(projectPath);
    console.log(`Project created: cd into ${name} and run npm install && npm run start`);
  } catch (err) {
    console.error('An error occurred while creating the project:', err);
  }
}
