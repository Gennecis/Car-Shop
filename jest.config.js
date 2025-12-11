module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000, // 30 seconds for async operations
  verbose: true,
  maxWorkers: 1 // Run tests sequentially to avoid MongoDB connection conflicts
};
