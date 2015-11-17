var testRunnerConfig = {
  describe: 'Stem stylus extensions',
  stylus: {
    use: function plugin(stylus) {
      stylus.include(__dirname + '../');
    },
    import: [
      '../index'
      ]
  }
}

require('stylus-test-runner')(testRunnerConfig)
