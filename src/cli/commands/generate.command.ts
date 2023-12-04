import got from 'got';
import { Command } from '../index.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;
  public readonly name = '--generate';

  public async execute(...params: string[]): Promise<void> {
    const [count, filepath, url] = params;
    const offerCount = Number.parseInt(count, 10);

    this.initialData = await got.get(url).json().catch(() => {
      throw new Error(url ? `Can't fetch data from ${url}.` : 'incorrect filepath');
    }) as MockServerData;

    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }

    console.log(`File ${filepath} was created!`);
  }
}
