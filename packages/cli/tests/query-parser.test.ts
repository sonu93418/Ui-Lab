import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseQueryToConfig } from '../src/commands/generate.js';

describe('Deterministic Natural Language Query Parser (PRD Section 12)', () => {
  it('parses "premium modern landing page with pricing"', () => {
    const config = parseQueryToConfig('premium modern landing page with pricing');
    assert.equal(config.interface, 'landing-page');
    assert.equal(config.theme, 'modern');
    assert.equal(config.variant, 'premium');
    assert.ok(config.sections.includes('pricing'));
    assert.ok(config.sections.includes('navbar'));
    assert.ok(config.sections.includes('footer'));
  });

  it('parses "dark minimal dashboard with analytics"', () => {
    const config = parseQueryToConfig('dark minimal dashboard with analytics');
    assert.equal(config.interface, 'dashboard');
    assert.equal(config.theme, 'minimal');
    assert.equal(config.colorMode, 'dark');
  });

  it('parses "auth login page"', () => {
    const config = parseQueryToConfig('auth login page');
    assert.equal(config.interface, 'auth');
  });

  it('parses multi-section landing page query', () => {
    const config = parseQueryToConfig('landing page with hero, features, pricing, and faq');
    assert.equal(config.interface, 'landing-page');
    assert.ok(config.sections.includes('hero'));
    assert.ok(config.sections.includes('features'));
    assert.ok(config.sections.includes('pricing'));
    assert.ok(config.sections.includes('faq'));
  });
});
