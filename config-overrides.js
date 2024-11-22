module.exports = {
    webpack: (config, env) => {
      if (env === 'production') {
        config.entry = {
          main: './src/index.js',
          popup: './src/extensionIndex.js',
        };
        config.output.filename = '[name].js';
      }
      return config;
    },
  };