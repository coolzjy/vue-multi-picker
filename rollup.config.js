import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [vue(), buble()],
  dest: 'dist/index.common.js'
};
