// https://janessagarrow.com/blog/typescript-and-esbuild/
const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  outfile: 'lib/index.js',
  plugins: [nodeExternalsPlugin()],
});
