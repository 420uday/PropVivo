// jest-dom adds custom jest matchers for asserting on DOM nodes
import '@testing-library/jest-dom/extend-expect';

// Add custom Jest matchers
import { toHaveExactTextContent, toBeVisible } from './test-utils/matchers';

// Mock global objects
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
window.IntersectionObserver = MockIntersectionObserver;

// Global mocks and configurations
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
    writable: true
  });

  // Mock console methods
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
});

afterEach(() => {
  // Clear localStorage between tests
  window.localStorage.clear();
});

// Add custom matchers to Jest
expect.extend({
  toHaveExactTextContent,
  toBeVisible,
  /**
   * Check if element has the exact CSS class
   */
  toHaveExactClass(received, expectedClass) {
    const pass = received.className.split(' ').includes(expectedClass);
    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to have class "${expectedClass}"`
          : `Expected element to have class "${expectedClass}" but got "${received.className}"`,
    };
  }
});

// Configure test timeout
jest.setTimeout(10000); // 10 seconds   