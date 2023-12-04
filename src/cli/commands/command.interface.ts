export interface Command {
  readonly name: string;
  execute(...parameters: string[]): Promise<void> | void;
}
