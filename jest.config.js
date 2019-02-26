module.exports = {
  moduleFileExtensions: ['js', 'json'],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  transform: {
    '^.+\\.js$': './test/transform.js'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
}
