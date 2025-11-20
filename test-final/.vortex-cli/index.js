#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("./commands/create");
const dev_1 = require("./commands/dev");
const build_1 = require("./commands/build");
const program = new commander_1.Command();
program
    .name('vortex')
    .description('CLI pour créer et gérer des projets Vortex')
    .version('0.1.0');
program
    .command('create <project-name>')
    .description('Créer un nouveau projet Vortex')
    .action(create_1.createProject);
program
    .command('dev')
    .description('Lancer le serveur de développement')
    .action(dev_1.devCommand);
program
    .command('build')
    .description('Build le projet pour la production')
    .action(build_1.buildCommand);
program.parse();
