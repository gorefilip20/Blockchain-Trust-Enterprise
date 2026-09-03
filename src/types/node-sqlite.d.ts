declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(location: string);
    exec(sql: string): void;
    prepare(sql: string): {
      get(...params: unknown[]): any;
      all(...params: unknown[]): any[];
      run(...params: unknown[]): any;
    };
  }
}
