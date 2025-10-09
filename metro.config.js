const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

<<<<<<< HEAD
// Add 'bin' to assetExts
config.resolver.assetExts.push('bin');

=======
>>>>>>> f40eb7428653cf041ce3cf4b0237e0a2ccc56142
// Use turborepo to restore the cache when possible
config.cacheStores = [
    new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
  ];

module.exports = config;
