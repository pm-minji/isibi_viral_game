/**
 * HTML Structure and Accessibility Tests
 * 
 * Validates:
 * - Proper HTML structure
 * - Accessibility features
 * - Required elements presence
 * - Semantic HTML usage
 */

const fs = require('fs');
const path = require('path');

describe('HTML Structure Tests', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  });

  describe('Document Structure', () => {
    test('should have DOCTYPE declaration', () => {
      expect(htmlContent).toMatch(/<!DOCTYPE html>/i);
    });

    test('should have html element with lang attribute', () => {
      expect(htmlContent).toMatch(/<html[^>]*lang=/i);
    });

    test('should have proper charset meta tag', () => {
      expect(htmlContent).toMatch(/<meta[^>]*charset=["']UTF-8["']/i);
    });

    test('should have viewport meta tag for mobile optimization', () => {
      expect(htmlContent).toMatch(/<meta[^>]*name=["']viewport["']/i);
      expect(htmlContent).toContain('width=device-width');
    });

    test('should have title element', () => {
      expect(htmlContent).toMatch(/<title>.*<\/title>/i);
    });

    test('should link to stylesheet', () => {
      expect(htmlContent).toMatch(/<link[^>]*href=["']style\.css["']/i);
    });

    test('should link to game script', () => {
      expect(htmlContent).toMatch(/<script[^>]*src=["']game\.js["']/i);
    });
  });

  describe('Game Elements', () => {
    test('should have game container', () => {
      expect(htmlContent).toMatch(/id=["']game-container["']/);
    });

    test('should have canvas element', () => {
      expect(htmlContent).toMatch(/<canvas[^>]*id=["']game-canvas["']/);
    });

    test('should have UI layer', () => {
      expect(htmlContent).toMatch(/id=["']ui-layer["']/);
    });

    test('should have start screen', () => {
      expect(htmlContent).toMatch(/id=["']start-screen["']/);
    });

    test('should have HUD element', () => {
      expect(htmlContent).toMatch(/id=["']hud["']/);
    });

    test('should have game over screen', () => {
      expect(htmlContent).toMatch(/id=["']game-over-screen["']/);
    });

    test('should have altitude display', () => {
      expect(htmlContent).toMatch(/id=["']altitude-value["']/);
    });

    test('should have boost gauge', () => {
      expect(htmlContent).toMatch(/id=["']boost-fill["']/);
    });

    test('should have final altitude display', () => {
      expect(htmlContent).toMatch(/id=["']final-altitude["']/);
    });
  });

  describe('Interactive Elements', () => {
    test('should have start button', () => {
      expect(htmlContent).toMatch(/id=["']start-button["']/);
    });

    test('should have restart button', () => {
      expect(htmlContent).toMatch(/id=["']restart-button["']/);
    });

    test('should have share button', () => {
      expect(htmlContent).toMatch(/id=["']share-button["']/);
    });

    test('all buttons should have button element', () => {
      const buttonMatches = htmlContent.match(/<button[^>]*id=["'](start-button|restart-button|share-button)["']/g);
      expect(buttonMatches).toHaveLength(3);
    });
  });

  describe('Content Structure', () => {
    test('should have game title heading', () => {
      expect(htmlContent).toMatch(/<h1>/i);
    });

    test('should have description text', () => {
      expect(htmlContent).toMatch(/class=["']description["']/);
    });

    test('should have instructions', () => {
      expect(htmlContent).toMatch(/class=["']instructions["']/);
    });

    test('should have glass card styling container', () => {
      expect(htmlContent).toMatch(/class=["']glass-card["']/);
    });

    test('should have end title for game over', () => {
      expect(htmlContent).toMatch(/id=["']end-title["']/);
    });
  });

  describe('Fonts and External Resources', () => {
    test('should preconnect to Google Fonts', () => {
      expect(htmlContent).toMatch(/<link[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.googleapis\.com["']/i);
      expect(htmlContent).toMatch(/<link[^>]*rel=["']preconnect["'][^>]*href=["']https:\/\/fonts\.gstatic\.com["']/i);
    });

    test('should load required fonts', () => {
      expect(htmlContent).toMatch(/fonts\.googleapis\.com\/css2/);
    });

    test('should include Korean font (Noto Sans KR)', () => {
      expect(htmlContent).toMatch(/Noto\+Sans\+KR/i);
    });

    test('should include Latin font (Outfit)', () => {
      expect(htmlContent).toMatch(/Outfit/i);
    });
  });

  describe('Mobile Optimization', () => {
    test('viewport should prevent user scaling', () => {
      expect(htmlContent).toMatch(/user-scalable=no/i);
    });

    test('viewport should set maximum scale', () => {
      expect(htmlContent).toMatch(/maximum-scale=1\.0/i);
    });

    test('viewport should use viewport-fit cover', () => {
      expect(htmlContent).toMatch(/viewport-fit=cover/i);
    });
  });

  describe('Semantic HTML', () => {
    test('should use semantic div structure', () => {
      const divCount = (htmlContent.match(/<div/g) || []).length;
      expect(divCount).toBeGreaterThan(0);
    });

    test('should have proper heading hierarchy', () => {
      expect(htmlContent).toMatch(/<h1>/i);
      expect(htmlContent).toMatch(/<h2>/i);
    });

    test('should use button elements for interactions', () => {
      const buttonCount = (htmlContent.match(/<button/g) || []).length;
      expect(buttonCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Localization', () => {
    test('should include Korean language content', () => {
      // Check for Korean characters
      expect(htmlContent).toMatch(/[가-힣]/);
    });

    test('should have lang attribute set to Korean', () => {
      expect(htmlContent).toMatch(/<html[^>]*lang=["']ko["']/i);
    });
  });

  describe('Code Quality', () => {
    test('should have proper indentation', () => {
      const lines = htmlContent.split('\n');
      const indentedLines = lines.filter(line => line.match(/^\s{2,}/));
      expect(indentedLines.length).toBeGreaterThan(0);
    });

    test('should have HTML comments for documentation', () => {
      expect(htmlContent).toMatch(/<!--.*-->/s);
    });

    test('should not have inline styles', () => {
      // Inline styles are allowed on boost-fill for dynamic updates
      const inlineStyles = htmlContent.match(/<[^>]+style=["'][^"']*["']/gi) || [];
      // Only boost-fill should have style attribute
      expect(inlineStyles.length).toBeLessThanOrEqual(1);
    });

    test('should not have inline scripts', () => {
      const scriptTags = htmlContent.match(/<script(?![^>]*src=)[^>]*>/gi);
      expect(scriptTags).toBeNull();
    });
  });
});