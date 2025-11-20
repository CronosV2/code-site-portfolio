#!/usr/bin/env node

import { Command } from 'commander';
import { createProject } from './commands/create';
import { devCommand } from './commands/dev';
import { buildCommand } from './commands/build';

const program = new Command();

program
  .name('vortex')
  .description('CLI pour créer et gérer des projets Vortex')
  .version('0.1.0');

program
  .command('create <project-name>')
  .description('Créer un nouveau projet Vortex')
  .action(createProject);

program
  .command('dev')
  .description('Lancer le serveur de développement')
  .action(devCommand);

program
  .command('build')
  .description('Build le projet pour la production')
  .action(buildCommand);

program.parse();
