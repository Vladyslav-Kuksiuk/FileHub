import {nodeResolve} from '@rollup/plugin-node-resolve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';
import dev from 'rollup-plugin-dev';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    entryFileNames: 'app-[hash].js',
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: [
        ['@babel/plugin-proposal-decorators', {
          version: '2022-03',
        }],
        ['@babel/plugin-syntax-decorators'],
      ],
    }),
    nodeResolve(),
    commonjs(),
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
    dev({
      port: 3000,
      dirs: ['dist'],
      proxy: [{from: '/api', to: 'http://localhost:3001'}],
    }),
    livereload(),
  ],
};
