module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'valid-jsdoc': ['error', {
      requireParamDescription: false,
      requireReturnDescription: false,
      requireReturn: false,
      prefer: {return: 'returns'},
    }],
    'max-len': ['error', {code: 120}],
    'no-console': 'error',
    'no-debugger': 'error',
  },
};
