const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, '../../'),  // Adjust the path as necessary
  output: {
    path: join(__dirname, '../../dist/services/plaid-service'),
  },
  resolve: {
    symlinks: false,
    extensions: ['.tsx', '.ts', '.js', '.json', '.proto'],
    modules: [path.resolve(__dirname, '../../libs'), 'node_modules'],
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets', {
        input: path.resolve(__dirname, '../../libs/protos/src/lib'),
        glob: '**/*.proto',
        output: './protos'
      }],
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
