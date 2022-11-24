import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';

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
    babel({
      babelHelpers: 'bundled',
      plugins: [
        ['@babel/plugin-proposal-decorators', {
          version: '2022-03',
        }],
      ],
    }),
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
