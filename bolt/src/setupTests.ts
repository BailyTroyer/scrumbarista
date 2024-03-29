import { server } from "./mocks/server";

beforeAll(() => {
  jest.useFakeTimers("modern");
  jest.setSystemTime(new Date(1998, 4, 9));
});

afterAll(() => {
  jest.useRealTimers();
});

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
