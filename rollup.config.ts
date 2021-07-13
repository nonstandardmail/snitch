import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const libraryName = 'snitch'

export default {
  input: `src/index.ts`,
  output: {
    file: `dist/${libraryName}.min.js`,
    name: libraryName,
    format: 'iife',
    sourcemap: true
  },
  plugins: [typescript(), commonjs(), nodeResolve(), sourceMaps(), terser()]
}
