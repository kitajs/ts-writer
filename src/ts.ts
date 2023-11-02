import type { Filename, TsFile, TsValue } from './types';

export function ts(
  templateStrings: TemplateStringsArray,
  filename: Filename,
  ...values: (TsValue | TsValue[] | typeof ts.types)[]
): TsFile {
  if (filename.match(/(\.d)?\.(t|j)sx?$/)) {
    throw new Error(
      `Filename ${filename} must not have a js related extension extension.`
    );
  }

  // removes first empty string because of filename
  const strings = templateStrings.slice(1);
  const matches = [];

  // Remove trailing whitespace.
  if (strings.length) {
    strings[strings.length - 1] = strings[strings.length - 1]!.replace(
      /\r?\n([\t ]*)$/,
      ''
    );
  }

  // Find all line breaks to determine the highest common indentation level.
  for (let match, i = 0; i < strings.length; i++) {
    if (
      (match = strings[i]!.match(/\n[\t ]+/g)) &&
      // Ignore if lower spacing is from the ts.types directive.
      values[i] !== ts.types
    ) {
      matches.push(...match);
    }
  }

  // Remove the common indentation from all strings.
  if (matches.length) {
    const size = Math.min(...matches.map((value) => value.length - 1));
    const pattern = new RegExp(`\n[\t ]{${size}}`, 'g');

    for (let i = 0; i < strings.length; i++) {
      strings[i] = strings[i]!.replace(pattern, '\n');
    }
  }

  let isSource = true;
  let source = '';
  let types = '';

  for (const value of values) {
    // Switch to types.
    if (value === ts.types) {
      // Last source bit.
      source += strings.shift()!;
      // No more source.
      isSource = false;
      continue;
    }

    const stringifiedValue =
      // Ignore falsy values
      value === null || value === undefined
        ? ''
        : value instanceof Array
        ? ts.join(value, '\n')
        : String(value);

    if (isSource) {
      source += strings.shift()!;
      source += stringifiedValue;
    } else {
      types += strings.shift()!;
      types += stringifiedValue;
    }
  }

  // last part.
  if (isSource) {
    source += strings.shift()!;
  } else {
    types += strings.shift()!;
  }

  return {
    source: {
      filename: `${filename}.js`,
      content: source.trim()
    },
    types: {
      filename: `${filename}.d.ts`,
      content: types.trim()
    }
  };
}

/** This delimiter makes everything after it the start of the types file. */
ts.types = Symbol.for('kKitaTsTypes');

/** Join items inside a list. Defaults to joining with a newline. */
ts.join = (items: (TsValue | TsValue[])[], join = '\n') =>
  items
    .filter((i) => i !== null && i !== undefined)
    .map((value) => (value instanceof Array ? value.join(join) : String(value)))
    .join(join);

ts/* ts */ `${'my file'}

function test() {
  console.log('Hello with syntax highlighting!')
}

`;
