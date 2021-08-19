import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { join as joinPath } from 'path'
import { terser } from 'rollup-plugin-terser'

export default {
  input: joinPath(__dirname, 'index.ts'),
  output: {
    file: joinPath(__dirname, 'dist/iife.min.js'),
    name: 'createSnitch',
    format: 'iife',
    sourcemap: false
  },
  plugins: [typescript(), commonjs(), nodeResolve(), terser({ format: { comments: false } })]
}
