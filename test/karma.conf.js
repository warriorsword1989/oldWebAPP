module.exports = function (config) {
    config.set({

        basePath: '../',

        files: [
            {pattern: 'scripts/libs/jquery/2.1.1/jquery-2.1.1.js', included: false},
            {pattern: 'scripts/libs/angularjs/1.4.4/angular.js', included: false},
            {pattern: 'scripts/libs/angularjs/1.4.4/angular-mocks.js', included: false},
            {pattern: 'scripts/libs/ocLazyLoad/ocLazyLoad.require.js', included: false},
            {pattern: 'scripts/libs/ui-layout/ui-layout.js', included: false},
            {pattern: 'scripts/libs/leaflet-0.7.3/leaflet-src.js', included: false},
            {pattern: 'test/libs.js', included: false},
            {pattern: 'apps/roadnet/Application.js', included: false},
            {pattern: 'apps/roadnet/appOfEditor.js', included: false},
            {pattern: 'apps/roadnet/layerConfigNew.js', included: false},
            {pattern: 'test/unit/*Spec.js', included: false},

            'test/unit/test-main.js'
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