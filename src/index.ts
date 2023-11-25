#!/usr/bin/env node

import fs from 'node:fs';
import CFonts from 'cfonts';
import inquirer from 'inquirer';
import { program } from 'commander';
import download from 'download-git-repo';

import packageInfo from '../package.json';
import templates from './templates.json';

program.version(packageInfo.version, '-v, --version', 'Output The Current Version');

program
  .command('info')
  .description('Output Project Information')
  .action(() => {
    CFonts.say('CREATE-APP', { font: 'shade', align: 'left', colors: ['#f80', '#840'] });
    console.log('Verison:', packageInfo.version);
    console.log(
      'Description: The Project Can Provide All Kinds Of Front-end Templates For You, Just Have A Nice Try!'
    );
    process.exit(0);
  });

program
  .command('list')
  .description('List All Templates')
  .action(() => {
    const allTemplates: { [key: string]: string }[] = [];
    templates.forEach((template: { name: string; description: string }) => {
      const templateItem = {
        templateName: template.name,
        description: template.description,
      };
      allTemplates.push(templateItem);
    });
    console.table(allTemplates);
    process.exit(0);
  });

program
  .command('add')
  .description('Add Local Template To CLI')
  .action(() => {
    const templatePlatforms = ['GitHub'];
    const branchNames = ['main', 'master'];
    inquirer
      .prompt([
        { type: 'input', name: 'name', message: 'Template Name: ' },
        { type: 'input', name: 'author', message: 'GitHub UserName: ', default: 'jaysonwu991' },
        {
          type: 'input',
          name: 'description',
          message: 'Description: ',
          default: 'A Template Project',
        },
        { type: 'list', name: 'platform', message: 'Template From: ', choices: templatePlatforms },
        { type: 'list', name: 'branch', message: 'From Branch: ', choices: branchNames },
      ])
      .then((answers = {}) => {
        if (!answers.name.trim() || !answers.author.trim()) {
          console.log('Add Local Template To CLI Failed: ');
          process.exit(0);
        }
        const template = {
          name: answers.name,
          description: answers.description,
          url: `https://github.com/${answers.author}/${answers.name}`,
          downloadUrl: `https://github.com:${answers.author}/${answers.name}#${answers.branch}`,
        };
        templates.push(template);
        fs.writeFile('templates.json', JSON.stringify(templates, null, 2), (err) => {
          if (err) {
            console.log('Add Local Template To CLI Failed: ', err);
            process.exit(0);
          }
          console.log('Add Local Template To CLI Successful');
        });
      })
      .catch((err) => {
        console.log('Add Local Template To CLI Failed: ', err);
        process.exit(0);
      });
  });

program
  .command('init')
  .description('Initialize Project Through Template')
  .action(() => {
    const projectName = 'original-project';
    const templateNames: Array<string> = [];
    templates.forEach((template: { name: string }) => {
      templateNames.push(template.name);
    });
    inquirer
      .prompt([
        { type: 'input', name: 'name', message: 'Project Name: ', default: projectName },
        { type: 'list', name: 'template', message: 'Project Template: ', choices: templateNames },
        {
          type: 'input',
          name: 'description',
          message: 'Project Description: ',
          default: 'A Template Project',
        },
        {
          type: 'input',
          name: 'author',
          message: 'Project Author: ',
          default: 'Jayson Wu <jaysonwu991@outlook.com>',
        },
      ])
      .then((answers = {}) => {
        const templateName = answers.template;
        delete answers.template;

        console.log('Template Downloading');

        const { downloadUrl } =
          templates.find((template: { name: string }) => templateName === template.name) || {};
        download(downloadUrl, answers.name || projectName, { clone: true }, (err: Error) => {
          if (err) {
            console.error('Template Downloading Failed');
            process.exit(0);
          }

          console.log('Template Downloading Successful');

          const packagePath = `${answers.name || projectName}/package.json`;
          const packageContent = fs.readFileSync(packagePath, 'utf8');
          const newPackageContent = JSON.stringify(
            { ...JSON.parse(packageContent), ...answers },
            null,
            2
          );

          fs.writeFileSync(packagePath, newPackageContent);

          console.log('\n', 'Initialize Your Project Successful');
        });
      })
      .catch((err) => {
        console.log('Initialize Your Project Failed: ', err);
        process.exit(0);
      });
  });

program.parse(process.argv);
