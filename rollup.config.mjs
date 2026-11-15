export default {
  input: {
    index: './src/index.js',
    'plugins/index': './src/plugins/index.js'
  },
  output: {
    dir: 'lib',
    format: 'cjs',
    interop: 'auto',
    entryFileNames: '[name].cjs',
    exports: 'named',
    preserveModules: true,
    preserveModulesRoot: 'src'
  }
}
