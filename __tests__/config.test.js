/**
 * Configuration File Validation Tests
 * 
 * Validates:
 * - YAML syntax and structure
 * - Required configuration keys
 * - Valid configuration values
 * - CodeRabbit integration settings
 */

const fs = require('fs');
const path = require('path');

describe('Configuration File Tests', () => {
  describe('.coderabbit.yaml validation', () => {
    let yamlContent;

    beforeAll(() => {
      const yamlPath = path.join(__dirname, '..', '.coderabbit.yaml');
      yamlContent = fs.readFileSync(yamlPath, 'utf8');
    });

    test('should exist and be readable', () => {
      expect(yamlContent).toBeTruthy();
      expect(yamlContent.length).toBeGreaterThan(0);
    });

    test('should have valid YAML structure', () => {
      // Check for basic YAML syntax (key: value pairs)
      expect(yamlContent).toMatch(/\w+:/);
      // Should not have syntax errors (tabs, mixed indentation issues)
      const lines = yamlContent.split('\n');
      lines.forEach((line, index) => {
        if (line.trim() && !line.trim().startsWith('#')) {
          expect(line).not.toMatch(/\t/); // No tabs
        }
      });
    });

    test('should have language configuration', () => {
      expect(yamlContent).toMatch(/language:\s*["']?ko-KR["']?/);
    });

    test('should have reviews section', () => {
      expect(yamlContent).toMatch(/reviews:/);
    });

    test('should configure review_status', () => {
      expect(yamlContent).toMatch(/review_status:\s*(true|false)/);
    });

    test('should have auto_review settings', () => {
      expect(yamlContent).toMatch(/auto_review:/);
      expect(yamlContent).toMatch(/enabled:\s*(true|false)/);
    });

    test('should have ignore_usernames configuration', () => {
      expect(yamlContent).toMatch(/ignore_usernames:/);
    });

    test('should have schema reference comment', () => {
      expect(yamlContent).toMatch(/yaml-language-server.*schema/i);
      expect(yamlContent).toMatch(/coderabbit\.ai/);
    });

    test('should use proper YAML indentation', () => {
      const lines = yamlContent.split('\n');
      const indentedLines = lines.filter(line => 
        line.length > 0 && line.trim().length > 0 && !line.trim().startsWith('#')
      );
      
      // Check that indentation is consistent (multiples of 2)
      indentedLines.forEach(line => {
        const spaces = line.match(/^\s*/)[0].length;
        if (spaces > 0) {
          expect(spaces % 2).toBe(0);
        }
      });
    });

    test('should have valid boolean values', () => {
      const booleanMatches = yamlContent.match(/:  (true|false)/g);
      expect(booleanMatches).not.toBeNull();
      expect(booleanMatches.length).toBeGreaterThan(0);
    });

    test('should have comments for documentation', () => {
      const commentMatches = yamlContent.match(/#.*$/gm);
      expect(commentMatches).not.toBeNull();
      expect(commentMatches.length).toBeGreaterThan(0);
    });

    test('language should be set to Korean', () => {
      expect(yamlContent).toMatch(/language:\s*["']?ko-KR["']?/);
    });

    test('auto_review should be enabled', () => {
      const autoReviewSection = yamlContent.match(/auto_review:[^]*?enabled:\s*(true|false)/);
      expect(autoReviewSection).not.toBeNull();
      expect(autoReviewSection[0]).toContain('enabled: true');
    });

    test('should not have trailing whitespace', () => {
      const lines = yamlContent.split('\n');
      lines.forEach((line, index) => {
        if (line.length > 0) {
          expect(line).not.toMatch(/\s+$/);
        }
      });
    });

    test('should end with newline', () => {
      expect(yamlContent).toMatch(/\n$/);
    });
  });

  describe('Configuration value validation', () => {
    test('language code should be valid', () => {
      // ko-KR is a valid BCP 47 language tag
      const validLanguageCodes = ['ko-KR', 'en-US', 'ja-JP', 'zh-CN'];
      const yamlContent = fs.readFileSync(path.join(__dirname, '..', '.coderabbit.yaml'), 'utf8');
      const langMatch = yamlContent.match(/language:\s*["']?([^"'\n]+)["']?/);
      expect(langMatch).not.toBeNull();
      expect(validLanguageCodes).toContain(langMatch[1].trim());
    });

    test('review_status should be boolean', () => {
      const yamlContent = fs.readFileSync(path.join(__dirname, '..', '.coderabbit.yaml'), 'utf8');
      const reviewStatusMatch = yamlContent.match(/review_status:\s*(true|false)/);
      expect(reviewStatusMatch).not.toBeNull();
      expect(['true', 'false']).toContain(reviewStatusMatch[1]);
    });

    test('auto_review enabled should be boolean', () => {
      const yamlContent = fs.readFileSync(path.join(__dirname, '..', '.coderabbit.yaml'), 'utf8');
      const enabledMatch = yamlContent.match(/enabled:\s*(true|false)/);
      expect(enabledMatch).not.toBeNull();
      expect(['true', 'false']).toContain(enabledMatch[1]);
    });

    test('ignore_usernames should be array', () => {
      const yamlContent = fs.readFileSync(path.join(__dirname, '..', '.coderabbit.yaml'), 'utf8');
      expect(yamlContent).toMatch(/ignore_usernames:\s*\[.*\]/);
    });
  });
});