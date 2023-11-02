/**
 * A TsFile is the result of a ts`` call, with its source, declaration, and respective
 * filenames
 */
export interface TsFile {
  source: {
    filename: string;
    content: string;
  };
  types: {
    filename: string;
    content: string;
  };
}

/**
 * A TsValue is any value available in TypeScript. It can be a number, boolean, string.
 * Arrays are joined with newlines. Objects are serialized with fast
 */
export type TsValue = number | boolean | string | null | undefined;

/**
 * The first argument of the ts function is the filename. It should not contain any file
 * extension like `.ts` or `.js`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Filename = string & {};
