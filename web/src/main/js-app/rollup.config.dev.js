import {nodeResolve} from '@rollup/plugin-node-resolve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    entryFileNames: 'app-[hash].js',
  },
  plugins: [
    nodeResolve(),
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
    serve({
      open: true,
      port: 3000,
      contentBase: 'dist',
    }),
    livereload(),
  ],
};
