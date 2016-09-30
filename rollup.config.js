import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [vue(), babel()],
  dest: 'dist/index.common.js'
};
