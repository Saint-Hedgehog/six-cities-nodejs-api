import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { RentOffer } from '../../shared/types/rent-offer.type.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray();

      offers.forEach(({type, city, goods, user, location, ...rest}: RentOffer) => {
        const {name, email, avatarPath, password, type: isPro} = user;
        console.log('city: ', chalk.green(city));
        console.log('type: ', chalk.blue(type));
        console.log('goods: ', chalk.cyan(goods));
        console.log('user: ', chalk.yellow(name, email, avatarPath, password, isPro));
        console.log('location: ', chalk.redBright(location.latitude, location.longitude));
        console.log(rest);
      });
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
