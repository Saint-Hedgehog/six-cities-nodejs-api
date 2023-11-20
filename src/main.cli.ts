#!/usr/bin/env node
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

function bootstrap() {
  const cliApp = new CLIApplication();
  cliApp.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  cliApp.executeCommand(process.argv);
}

bootstrap();
