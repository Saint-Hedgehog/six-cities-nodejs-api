import EventEmitter from 'node:events';
import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriterInterface } from './file-writer.interface.js';

export class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {

    const canWrite = this.stream.write(`${row}\n`);

    if (!canWrite) {
      await EventEmitter.once(this.stream, 'drain');
    }
  }
}
