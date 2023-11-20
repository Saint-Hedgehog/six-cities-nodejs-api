import chalk from 'chalk';
import { CommandInterface } from '../index.js';
import { getErrorMessage, createOffer } from '../../shared/helpers/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';

export class ImportCommand implements CommandInterface {
  public readonly name = '--import';

  private onNewLine(line: string) {
    const rentOffer = createOffer(line);
    const {type, city, goods, user, location, ...rest} = rentOffer;
    const {name, email, avatarPath, type: isPro} = user;

    console.log('city: ', chalk.green(city));
    console.log('type: ', chalk.blue(type));
    console.log('user: ', chalk.yellow(name, email, avatarPath, isPro));
    console.log('goods: ', chalk.cyan(goods));
    console.log('location: ', chalk.redBright(location.latitude, location.longitude));
    console.log(rest);
  }

  private onComplete(count: number) {
    console.log(`${count} rows has been imported.`);
  }

  public async execute(filename: string): Promise<void> {
    if (!filename) {
      throw new Error('File doesn\'t exist');
    }

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('newline', this.onNewLine);
    fileReader.on('end', this.onComplete);

    await fileReader.read().catch((err) => {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    });
  }
}
