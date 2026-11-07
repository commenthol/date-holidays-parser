export default {
  input: [
    './src/index.js'
  ],
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
