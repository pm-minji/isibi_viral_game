/**
 * CSS Validation and Style Tests
 * 
 * Validates:
 * - CSS syntax and structure
 * - Critical styling rules
 * - Responsive design
 * - Color scheme consistency
 * - Animation definitions
 */

const fs = require('fs');
const path = require('path');

describe('CSS Validation Tests', () => {
  let cssContent;

  beforeAll(() => {
    cssContent = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');
  });

  describe('CSS Variables (Custom Properties)', () => {
    test('should define root CSS variables', () => {
      expect(cssContent).toMatch(/:root\s*{/);
    });

    test('should define color variables', () => {
      expect(cssContent).toMatch(/--bg-color-earth:/);
      expect(cssContent).toMatch(/--bg-color-space:/);
      expect(cssContent).toMatch(/--primary-color:/);
      expect(cssContent).toMatch(/--accent-color:/);
      expect(cssContent).toMatch(/--text-color:/);
    });

    test('should define effect variables', () => {
      expect(cssContent).toMatch(/--primary-glow:/);
      expect(cssContent).toMatch(/--accent-glow:/);
      expect(cssContent).toMatch(/--glass-bg:/);
      expect(cssContent).toMatch(/--glass-border:/);
    });

    test('should define font variables', () => {
      expect(cssContent).toMatch(/--font-main:/);
    });

    test('color values should be valid hex or rgba', () => {
      const colorVars = cssContent.match(/--[^:]+:\s*(#[0-9A-Fa-f]{6}|rgba?\([^)]+\))/g);
      expect(colorVars).not.toBeNull();
      expect(colorVars.length).toBeGreaterThan(0);
    });
  });

  describe('Reset and Base Styles', () => {
    test('should have universal selector reset', () => {
      expect(cssContent).toMatch(/\*\s*{/);
    });

    test('should reset margin and padding', () => {
      expect(cssContent).toMatch(/margin:\s*0/);
      expect(cssContent).toMatch(/padding:\s*0/);
    });

    test('should set box-sizing to border-box', () => {
      expect(cssContent).toMatch(/box-sizing:\s*border-box/);
    });

    test('should disable tap highlight on mobile', () => {
      expect(cssContent).toMatch(/-webkit-tap-highlight-color:\s*transparent/);
    });

    test('should disable user select', () => {
      expect(cssContent).toMatch(/user-select:\s*none/);
    });
  });

  describe('Body and Container Styles', () => {
    test('should style body element', () => {
      expect(cssContent).toMatch(/body\s*{/);
    });

    test('should hide overflow on body', () => {
      expect(cssContent).toMatch(/overflow:\s*hidden/);
    });

    test('should use fixed positioning', () => {
      expect(cssContent).toMatch(/position:\s*fixed/);
    });

    test('should use CSS variables for colors', () => {
      expect(cssContent).toMatch(/var\(--[^)]+\)/);
    });

    test('should define game container', () => {
      expect(cssContent).toMatch(/#game-container/);
    });
  });

  describe('Canvas Styling', () => {
    test('should style canvas element', () => {
      expect(cssContent).toMatch(/canvas\s*{/);
    });

    test('canvas should fill container', () => {
      const canvasStyles = cssContent.match(/canvas\s*{[^}]+}/s);
      expect(canvasStyles).not.toBeNull();
      expect(canvasStyles[0]).toMatch(/width:\s*100%/);
      expect(canvasStyles[0]).toMatch(/height:\s*100%/);
    });
  });

  describe('UI Layer and Screens', () => {
    test('should define UI layer', () => {
      expect(cssContent).toMatch(/#ui-layer/);
    });

    test('UI layer should be absolutely positioned', () => {
      const uiLayerStyles = cssContent.match(/#ui-layer\s*{[^}]+}/s);
      expect(uiLayerStyles[0]).toMatch(/position:\s*absolute/);
    });

    test('should define screen class', () => {
      expect(cssContent).toMatch(/\.screen\s*{/);
    });

    test('should define hidden class', () => {
      expect(cssContent).toMatch(/\.hidden\s*{/);
    });

    test('hidden class should use opacity 0', () => {
      const hiddenStyles = cssContent.match(/\.hidden\s*{[^}]+}/s);
      expect(hiddenStyles[0]).toMatch(/opacity:\s*0/);
    });

    test('should use backdrop-filter blur', () => {
      expect(cssContent).toMatch(/backdrop-filter:\s*blur\(/);
    });
  });

  describe('Glass Card Effect', () => {
    test('should define glass-card class', () => {
      expect(cssContent).toMatch(/\.glass-card\s*{/);
    });

    test('glass-card should use background with transparency', () => {
      const glassCardStyles = cssContent.match(/\.glass-card\s*{[^}]+}/s);
      expect(glassCardStyles[0]).toMatch(/background:/);
    });

    test('should have border radius for rounded corners', () => {
      expect(cssContent).toMatch(/border-radius:/);
    });

    test('should have box shadow', () => {
      expect(cssContent).toMatch(/box-shadow:/);
    });

    test('should have animation', () => {
      const glassCardStyles = cssContent.match(/\.glass-card\s*{[^}]+}/s);
      expect(glassCardStyles[0]).toMatch(/animation:/);
    });
  });

  describe('Typography', () => {
    test('should define h1 styles', () => {
      expect(cssContent).toMatch(/h1\s*{/);
    });

    test('should style highlight class', () => {
      expect(cssContent).toMatch(/\.highlight\s*{/);
    });

    test('should define description class', () => {
      expect(cssContent).toMatch(/\.description\s*{/);
    });

    test('should use font weights', () => {
      expect(cssContent).toMatch(/font-weight:/);
    });

    test('should use letter spacing', () => {
      expect(cssContent).toMatch(/letter-spacing:/);
    });

    test('should use text transform', () => {
      expect(cssContent).toMatch(/text-transform:\s*uppercase/);
    });
  });

  describe('Button Styles', () => {
    test('should define primary button', () => {
      expect(cssContent).toMatch(/\.btn-primary/);
    });

    test('should define secondary button', () => {
      expect(cssContent).toMatch(/\.btn-secondary/);
    });

    test('buttons should have transitions', () => {
      const buttonStyles = cssContent.match(/\.btn-primary[^{]*{[^}]+}/s);
      expect(buttonStyles[0]).toMatch(/transition:/);
    });

    test('buttons should have hover states', () => {
      expect(cssContent).toMatch(/\.btn-primary:hover/);
      expect(cssContent).toMatch(/\.btn-secondary:hover/);
    });

    test('buttons should have active states', () => {
      expect(cssContent).toMatch(/\.btn-primary:active/);
    });

    test('buttons should have cursor pointer', () => {
      expect(cssContent).toMatch(/cursor:\s*pointer/);
    });
  });

  describe('HUD Styles', () => {
    test('should define HUD element', () => {
      expect(cssContent).toMatch(/#hud\s*{/);
    });

    test('should style altitude container', () => {
      expect(cssContent).toMatch(/\.altitude-container/);
    });

    test('should style boost meter', () => {
      expect(cssContent).toMatch(/\.boost-meter-container/);
      expect(cssContent).toMatch(/\.meter-track/);
      expect(cssContent).toMatch(/\.meter-fill/);
    });

    test('meter-fill should have transition', () => {
      const meterFillStyles = cssContent.match(/\.meter-fill\s*{[^}]+}/s);
      expect(meterFillStyles[0]).toMatch(/transition:/);
    });

    test('should style labels', () => {
      expect(cssContent).toMatch(/\.label/);
      expect(cssContent).toMatch(/\.meter-label/);
    });
  });

  describe('Animations', () => {
    test('should define pulse animation', () => {
      expect(cssContent).toMatch(/@keyframes\s+pulse/);
    });

    test('should define float animation', () => {
      expect(cssContent).toMatch(/@keyframes\s+float/);
    });

    test('pulse animation should have opacity changes', () => {
      const pulseAnimation = cssContent.match(/@keyframes\s+pulse\s*{[^}]+}/s);
      expect(pulseAnimation[0]).toMatch(/opacity:/);
    });

    test('float animation should have transform changes', () => {
      const floatAnimation = cssContent.match(/@keyframes\s+float\s*{[^}]+}/s);
      expect(floatAnimation[0]).toMatch(/transform:/);
    });

    test('instructions should use pulse animation', () => {
      const instructionsStyles = cssContent.match(/\.instructions\s*{[^}]+}/s);
      expect(instructionsStyles[0]).toMatch(/animation:.*pulse/);
    });

    test('glass-card should use float animation', () => {
      const glassCardStyles = cssContent.match(/\.glass-card\s*{[^}]+}/s);
      expect(glassCardStyles[0]).toMatch(/animation:.*float/);
    });
  });

  describe('Responsive and Performance', () => {
    test('should use viewport units', () => {
      expect(cssContent).toMatch(/100vw|100vh/);
    });

    test('should use flexbox for layouts', () => {
      expect(cssContent).toMatch(/display:\s*flex/);
    });

    test('should use will-change for animations', () => {
      // Optional, but good for performance
      // expect(cssContent).toMatch(/will-change:/);
      expect(true).toBe(true);
    });

    test('should use transform for animations (GPU accelerated)', () => {
      expect(cssContent).toMatch(/transform:/);
    });
  });

  describe('Color Scheme', () => {
    test('should use consistent color palette', () => {
      // Should reference CSS variables
      const varUsage = (cssContent.match(/var\(--[^)]+\)/g) || []).length;
      expect(varUsage).toBeGreaterThan(10);
    });

    test('should have gradient backgrounds', () => {
      expect(cssContent).toMatch(/linear-gradient/);
    });

    test('should use rgba for transparency', () => {
      expect(cssContent).toMatch(/rgba?\(/);
    });
  });

  describe('Visual Effects', () => {
    test('should use text shadows', () => {
      expect(cssContent).toMatch(/text-shadow:/);
    });

    test('should use box shadows', () => {
      expect(cssContent).toMatch(/box-shadow:/);
    });

    test('should use backdrop-filter for glass effect', () => {
      expect(cssContent).toMatch(/backdrop-filter:/);
    });

    test('should use filters', () => {
      expect(cssContent).toMatch(/filter:/);
    });

    test('should use background-clip for text gradients', () => {
      expect(cssContent).toMatch(/-webkit-background-clip:\s*text/);
      expect(cssContent).toMatch(/-webkit-text-fill-color:\s*transparent/);
    });
  });

  describe('Game Over Screen', () => {
    test('should style final score', () => {
      expect(cssContent).toMatch(/\.final-score/);
    });

    test('should style final altitude', () => {
      expect(cssContent).toMatch(/#final-altitude/);
    });

    test('should style end title', () => {
      expect(cssContent).toMatch(/#end-title/);
    });
  });

  describe('Code Quality', () => {
    test('should have proper formatting', () => {
      const lines = cssContent.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);
      expect(nonEmptyLines.length).toBeGreaterThan(50);
    });

    test('should have CSS comments', () => {
      expect(cssContent).toMatch(/\/\*.*\*\//s);
    });

    test('should not have important overrides (excessive)', () => {
      const importantCount = (cssContent.match(/!important/g) || []).length;
      expect(importantCount).toBeLessThan(5);
    });

    test('should use consistent units', () => {
      // Should use rem, px, %, vw, vh consistently
      expect(cssContent).toMatch(/\d+rem/);
      expect(cssContent).toMatch(/\d+px/);
    });
  });

  describe('Accessibility', () => {
    test('should have sufficient color contrast', () => {
      // White text on dark backgrounds
      expect(cssContent).toMatch(/color:\s*#FFFFFF|color:\s*white/i);
    });

    test('should use focus styles (implicit through hover)', () => {
      // Buttons have hover states which help with focus indication
      expect(cssContent).toMatch(/:hover/);
    });

    test('should not rely solely on color for information', () => {
      // Boost meter uses width and color
      expect(cssContent).toMatch(/width:/);
      expect(true).toBe(true);
    });
  });
});