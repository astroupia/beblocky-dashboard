module.exports = {
  preset: "ts-jest", // Use ts-jest for TypeScript support
  testEnvironment: "node", // Set the test environment to Node.js
  testPathIgnorePatterns: ["/node_modules/", "/dist/"], // Ignore these paths
  moduleFileExtensions: ["ts", "js", "json", "node"], // Specify file extensions Jest will look for
  transform: {
    "^.+\\.ts$": "ts-jest", // Transform TypeScript files using ts-jest
  },
};
