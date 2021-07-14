import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'

export default {
  input: `src/index.ts`,
  output: {
    file: `dist/snitch.min.js`,
    name: 'Snitch',
    format: 'iife',
    sourcemap: true
  },
  plugins: [typescript(), commonjs(), nodeResolve(), sourceMaps(), terser()]
}
