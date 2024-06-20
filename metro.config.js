const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname)
const { resolver, transformer } = defaultConfig
const { assetExts, sourceExts } = defaultConfig.resolver
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    transformer: {
        ...transformer, // <--- THIS WAS MISSING
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
      },
      resolver: {
        ...resolver, // <--- THIS WAS MISSING
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
      },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
