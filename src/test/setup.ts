import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';

// Mocking Prisma to avoid actual DB hits during unit tests
vi.mock('@/lib/prisma', () => ({
  prisma: {
    contest: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    prediction: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(vi.mocked(prisma))),
    $executeRawUnsafe: vi.fn(),
  },
}));

// Global window mock for JSDOM
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), 
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
