import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    entryFileNames: 'app-[hash].js',
    manualChunks(id) {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
  },
  plugins: [
    nodeResolve(),
    terser(),
    htmlTemplate({
      template: 'index.html',
      target: 'dist/index.html',
    }),
    copy({
      targets: [
        {src: 'static/styles', dest: 'dist/static'},
        {src: 'static/images', dest: 'dist/static'},
        {src: 'static/fonts', dest: 'dist/static'},
      ],
    }),
  ],
};
