import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CreateConfigSchema } from '../src/index.js';

describe('CreateConfigSchema (PRD Section 15 Specification)', () => {
  it('accepts the requested landing page configuration', () => {
    const result = CreateConfigSchema.safeParse({
      interface: 'landing-page',
      framework: 'next',
      theme: 'modern',
      colorMode: 'system',
      variant: 'premium',
      sections: ['navbar', 'hero', 'features', 'pricing', 'footer'],
      outputDir: 'src/components',
      dryRun: false,
      yes: false,
      force: false,
    });

    assert.equal(result.success, true);
  });

  it('rejects an unsupported section', () => {
    const result = CreateConfigSchema.safeParse({
      interface: 'landing-page',
      framework: 'next',
      theme: 'modern',
      colorMode: 'system',
      variant: 'premium',
      sections: ['navbar', 'unknown-section'],
      outputDir: 'src/components',
      dryRun: false,
      yes: false,
      force: false,
    });

    assert.equal(result.success, false);
  });

  it('rejects duplicate sections', () => {
    const result = CreateConfigSchema.safeParse({
      interface: 'landing-page',
      framework: 'next',
      theme: 'modern',
      colorMode: 'system',
      variant: 'premium',
      sections: ['navbar', 'navbar'],
      outputDir: 'src/components',
      dryRun: false,
      yes: false,
      force: false,
    });

    assert.equal(result.success, false);
  });

  it('applies defaults correctly', () => {
    const result = CreateConfigSchema.safeParse({
      interface: 'landing-page',
      sections: ['navbar', 'hero', 'footer'],
    });

    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.framework, 'next');
      assert.equal(result.data.theme, 'modern');
      assert.equal(result.data.colorMode, 'system');
      assert.equal(result.data.variant, 'premium');
      assert.equal(result.data.outputDir, 'src/components');
      assert.equal(result.data.dryRun, false);
      assert.equal(result.data.yes, false);
      assert.equal(result.data.force, false);
    }
  });
});
