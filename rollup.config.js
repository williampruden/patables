import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import analyze from 'rollup-plugin-analyzer'
import filesize from 'rollup-plugin-filesize'

const config = {
  input: 'src/index.js',
  external: ['react', 'prop-types', 'axios'],
  output: {
    format: 'umd',
    name: 'countdown',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      axios: 'axios'
    }
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    uglify(),
    analyze(),
    filesize()
  ]
}

export default config
