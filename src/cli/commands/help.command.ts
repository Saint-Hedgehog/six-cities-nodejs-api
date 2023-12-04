import chalk from 'chalk';
import { Command } from '../index.js';

export class HelpCommand implements Command {
  public readonly name = '--help';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.blue(`
    ${chalk.green('Программа для подготовки данных для REST API сервера.')}
        Пример:
        ${chalk.red('main.cli.js --<command> [--arguments]')}
        Команды:
        ${chalk.gray('--version:')}                   ${chalk.gray('# выводит номер версии')}
        ${chalk.green('--help:')}                      ${chalk.green('# печатает этот текст')}
        ${chalk.yellow('--import <path>:')}             ${chalk.yellow('# импортирует данные из TSV')}
        ${chalk.magenta('--generate <n> <path> <url>')}  ${chalk.magenta('# генерирует произвольное количество тестовых данных')}
    `));
  }
}
