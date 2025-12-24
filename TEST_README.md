# Rocket Escape - Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the Rocket Escape game, including unit tests for game logic, HTML structure validation, and CSS style verification.

## Test Structure

### 1. Game Logic Tests (`__tests__/game.test.js`)
Comprehensive unit tests covering:
- Game initialization and state management
- Physics engine (gravity, thrust, velocity calculations)
- Heat/boost management system
- Collision detection and boundaries
- User input handling (mouse and touch events)
- Background element generation and parallax effects
- Color interpolation utilities
- Particle system (exhaust and explosions)
- Game over conditions
- UI state transitions
- Share functionality
- Error handling and edge cases
- Performance under stress

### 2. HTML Structure Tests (`__tests__/html.test.js`)
Validates:
- Proper HTML5 document structure
- Required meta tags and accessibility features
- Presence of all game elements
- Interactive elements (buttons, canvas)
- Font loading and localization
- Mobile optimization settings
- Semantic HTML usage
- Code quality and documentation

### 3. CSS Validation Tests (`__tests__/css.test.js`)
Validates:
- CSS custom properties (variables)
- Reset and base styles
- Component-specific styling
- Glass morphism effects
- Typography and font usage
- Button states and interactions
- Animation definitions
- Responsive design patterns
- Color scheme consistency
- Visual effects (shadows, filters, gradients)
- Code quality and best practices

## Setup Instructions

### Installation
```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage Goals
- **Branches**: 70%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Test Environment

The tests run in a **jsdom** environment that simulates a browser DOM, allowing us to test browser-specific features like:
- Canvas rendering contexts
- Event handling
- DOM manipulation
- Window properties

### Mocked APIs
- `HTMLCanvasElement.prototype.getContext` - Canvas 2D context
- `requestAnimationFrame` / `cancelAnimationFrame`
- `navigator.share` - Web Share API
- Console methods (to reduce noise)

## Key Test Categories

### Happy Path Tests
- Normal game startup and play
- Standard physics interactions
- Expected user input patterns
- UI state transitions

### Edge Cases
- Extreme canvas dimensions
- Rapid state changes
- Missing UI elements
- Invalid color values
- Extended gameplay sessions

### Failure Conditions
- Rocket overheating and explosion
- Collision with ground
- Error handling in update loop
- Corrupted game state recovery

### Performance Tests
- Particle system limits
- Long gameplay sessions
- Rapid restarts
- Background element updates

## Writing New Tests

When adding new features, ensure tests cover:

1. **Initialization**: Does the feature initialize correctly?
2. **Happy Path**: Does it work under normal conditions?
3. **Edge Cases**: How does it handle unusual inputs?
4. **Failure Cases**: Does it fail gracefully?
5. **Integration**: Does it work with other features?

### Example Test Pattern

```javascript
describe('New Feature', () => {
  beforeEach(() => {
    // Setup
  });

  test('should initialize correctly', () => {
    // Arrange
    // Act
    // Assert
  });

  test('should handle edge case', () => {
    // Test edge case
  });

  afterEach(() => {
    // Cleanup
  });
});
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines. Ensure:
- All tests pass before merging
- Coverage thresholds are maintained
- No console errors or warnings

## Troubleshooting

### Common Issues

**Issue**: Tests timeout
**Solution**: Check for missing `done()` callbacks in async tests

**Issue**: Canvas context errors
**Solution**: Ensure jest setup properly mocks canvas methods

**Issue**: DOM element not found
**Solution**: Verify HTML structure in `beforeEach` setup

**Issue**: Animation tests fail
**Solution**: Remember that `requestAnimationFrame` is mocked with setTimeout

## Contributing

When contributing:
1. Write tests for new features
2. Update existing tests for changes
3. Maintain or improve coverage
4. Follow existing test patterns
5. Document complex test scenarios

## Test Philosophy

- **Comprehensive**: Cover all code paths
- **Maintainable**: Keep tests readable and well-organized
- **Fast**: Tests should run quickly
- **Isolated**: Each test should be independent
- **Meaningful**: Tests should verify behavior, not implementation details

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [JSDOM](https://github.com/jsdom/jsdom)

---

For questions or issues with the test suite, please open an issue in the repository.