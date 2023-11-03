import assert from 'assert';
import { test } from 'node:test';
import { ts } from '../src';

test('source only', () => {
  const file = ts`${'index'}console.log('hello world');`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: "console.log('hello world');"
    },
    types: {
      filename: 'index.d.ts',
      content: ''
    }
  });
});

test('type only', () => {
  const file = ts`${'index'}${ts.types}export type Foo = string;`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: ''
    },
    types: {
      filename: 'index.d.ts',
      content: 'export type Foo = string;'
    }
  });
});

test('source and types', () => {
  const file = ts`${'index'}console.log('hello world');${
    ts.types
  }export type Foo = string;`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: "console.log('hello world');"
    },
    types: {
      filename: 'index.d.ts',
      content: 'export type Foo = string;'
    }
  });
});

test('source with interpolation', () => {
  const file = ts`${'index'} a ${1} b ${'c'} ${['d', 'f']}`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: 'a 1 b c d\nf'
    },
    types: {
      filename: 'index.d.ts',
      content: ''
    }
  });
});

test('types with interpolation', () => {
  const file = ts`${'index'}${ts.types} a ${1} b ${'c'} ${['d', 'f']}`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: ''
    },
    types: {
      filename: 'index.d.ts',
      content: 'a 1 b c d\nf'
    }
  });
});

test('source and types with interpolation', () => {
  const file = ts`${'index'} a ${1} b ${'c'} ${['d', 'f']}${ts.types} a ${1} b ${'c'} ${[
    'd',
    'f'
  ]}`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: 'a 1 b c d\nf'
    },
    types: {
      filename: 'index.d.ts',
      content: 'a 1 b c d\nf'
    }
  });
});

test('Null and undefined are not rendered', () => {
  const file = ts`${'index'} a${null} ${1} b${undefined} ${'c'} ${['d', 'f']}${
    ts.types
  } a${null} ${1} b${undefined} ${'c'} ${['d', 'f']}`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'index.js',
      content: 'a 1 b c d\nf'
    },
    types: {
      filename: 'index.d.ts',
      content: 'a 1 b c d\nf'
    }
  });
});

test('throws when extension is provided', () => {
  assert.throws(
    () => ts`${'index.js'}console.log('hello world');`,
    /Error: Filename index.js must not have a js related extension extension./
  );
});

test('array usage', () => {
  const file = ts`${'array'}${[1, 2, 3]}`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'array.js',
      content: '1\n2\n3'
    },
    types: {
      filename: 'array.d.ts',
      content: ''
    }
  });
});

test('object usage', () => {
  const file = ts`${'object'}${{ z: 1, a: 2 }}`;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'object.js',
      // 'json-stable-stringify' sorts the keys to keep a consistent output.
      content: '{\n  "a": 2,\n  "z": 1\n}'
    },
    types: {
      filename: 'object.d.ts',
      content: ''
    }
  });
});

test('join usage', () => {
  assert.equal(ts.join([1, 2, 3]), '1\n2\n3');
  assert.equal(ts.join([1, 2, 3], ' '), '1 2 3');
});

test('multiline source', () => {
  const bar = 'bar';
  const foo = 'foo';

  const file = ts/*ts*/ `${'multiline'}
  'use strict';
  
  function ${foo}() {
    return '${foo}';
  }

  function ${bar}() {
    return '${bar}';
  }

  exports.${foo} = ${foo};
  exports.${bar} = ${bar};
  exports.list = [${ts.join([1, 2, 3], ', ')}]
  exports.__esModule = true;
  exports.default = { ${foo}, ${bar} };

  ${ts.types}

  export declare function ${foo}(): string;

  export declare function ${bar}(): string;

  export declare const list: number[];

  export default { ${foo}, ${bar} };
  `;

  assert.deepStrictEqual(file, {
    source: {
      filename: 'multiline.js',
      content: `

'use strict';

function foo() {
  return 'foo';
}

function bar() {
  return 'bar';
}

exports.foo = foo;
exports.bar = bar;
exports.list = [1, 2, 3]
exports.__esModule = true;
exports.default = { foo, bar };

`.trim()
    },

    types: {
      filename: 'multiline.d.ts',
      content: `

export declare function foo(): string;

export declare function bar(): string;

export declare const list: number[];

export default { foo, bar };

`.trim()
    }
  });
});
