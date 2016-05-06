module.exports = function (config) {
    config.set({

        basePath: '',

        files: [
            {pattern: 'scripts/libs/jquery/2.1.1/jquery2.1.1.js', included: false},
            {pattern: 'test/*Spec.js', included: false},

            'test/test-main.js'
        ],

        autoWatch: false,

        frameworks: ['jasmine', 'requirejs'],

        browsers: [],

        singleRun: false,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // 预处理配置，通常是代码覆盖率
        preprocessors: {
            'scripts\components\road\ctrls\*\*.js': ['coverage']
        },

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-requirejs'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};