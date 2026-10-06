import prettier from 'prettier';

/**
 * Format generated source code using Prettier.
 */
export async function formatCode(
  code: string,
  parser: 'typescript' | 'css' | 'json' = 'typescript'
): Promise<string> {
  try {
    return await prettier.format(code, {
      parser,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'es5',
      printWidth: 100,
    });
  } catch {
    // Return unformatted if prettier fails (e.g., syntax error in template)
    return code;
  }
}
