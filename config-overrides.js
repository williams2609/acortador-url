module.exports = {
  webpack: (config, env) => {
    if (env === 'production') {
      // Aquí aseguramos que `popup` también sea un punto de entrada
      config.entry = {
        main: './src/index.js',        // El punto de entrada principal
        popup: './src/extensionIndex.js',  // El punto de entrada para el popup
      };

      config.output.filename = '[name].js';  // Esto genera archivos [main].js y [popup].js

      // Aseguramos que se genera el archivo 'popup.js' también
      config.optimization.splitChunks = {
        chunks: 'all',
      };
    }
    return config;
  },
};