import {nodeResolve} from '@rollup/plugin-node-resolve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    dir: '../resources/web-client/',
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
    htmlTemplate({
      template: 'index.html',
      target: '../resources/web-client/index.html',
    }),
    copy({
      targets: [
        {src: 'static/styles', dest: '../resources/web-client/static'},
        {src: 'static/images', dest: '../resources/web-client/static'},
        {src: 'static/fonts', dest: '../resources/web-client/static'},
      ],
    }),
  ],
};
