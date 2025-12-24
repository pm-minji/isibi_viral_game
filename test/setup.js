// Jest setup file
require('@testing-library/jest-dom');

// Mock canvas methods that aren't available in jsdom
HTMLCanvasElement.prototype.getContext = function() {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    quadraticCurveTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    drawImage: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 }))
  };
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Suppress console errors in tests unless needed
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn()
};