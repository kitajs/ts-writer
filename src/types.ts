/**
 * A TsFile is the result of a ts`` call, with its source, declaration, and respective
 * filenames
 */
export interface TsFile {
  source: TsContent;
  types: TsContent;
}

/**
 * A simple filename with content.
 */
export interface TsContent {
  filename: string;
  content: string;
}

/**
 * A TsValue is any value available in TypeScript. It can be a number, boolean, string.
 *
 * Objects are serialized with `json-stable-stringify` and sorted by key. Arrays are
 * joined with newlines.
 */
export type TsValue = number | boolean | string | null | undefined | object;

/**
 * The first argument of the ts function is the filename. It should not contain any file
 * extension like `.ts` or `.js`.
 */
export type Filename = string & {};
