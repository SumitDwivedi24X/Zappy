const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config'). MetroConfig}
 */
const baseConfig = getDefaultConfig(__dirname);

const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const customConfig = {
  resolver: {
    // The backend lives in ./server with its own node_modules; keep Metro out of it.
    blockList: [
      new RegExp(`^${escapeRegExp(path.join(__dirname, 'server'))}\\/.*`),
    ],
  },
};

const mergedConfig = mergeConfig(baseConfig, customConfig);

module.exports = withNativeWind(mergedConfig, {
  input: './global.css',
});
