// Karma configuration
// Generated on Mon Nov 16 2015 10:39:53 GMT+0100 (WAT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'public/libs/angular/angular.js',
      'public/libs/angular-mocks/angular-mocks.js',
      'public/libs/angular-animate/angular-animate.min.js',
      'public/libs/angular-aria/angular-aria.min.js',
      'public/libs/angular-ui-router/release/angular-ui-router.min.js',
      'public/libs/angular-material/angular-material.min.js',
      'public/libs/ngstorage/ngStorage.min.js',
      'public/libs/angular-material-icons/angular-material-icons.min.js',
      'public/app/*.js',
      'public/app/**/*.js',
      'public/spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'docRouteSpec.js',
      'spec/docRouteSpec.js',
      'spec/userRouteSpec.js',
      'spec/userSpec.js',
      'spec/documentSpec.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
