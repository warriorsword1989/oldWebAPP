module.exports = function (config) {
    config.set({

        basePath: '../',

        files: [
            {pattern: 'scripts/libs/*/*/*.js', included: false},
            {pattern: 'scripts/libs/*/*.js', included: false},
            {pattern: 'test/libs.js', included: false},
            {pattern: 'apps/roadnet/*.js', included: false},
            {pattern: "scripts/uikits/road/*.js", included: false},
            {pattern: "scripts/components/road/ctrls/*/*.js", included: false},
            {pattern: "scripts/mapApi/*.js", included: false},
            {pattern: "scripts/mapApi/*/*.js", included: false},
            {pattern: "scripts/dataApi/*.js", included: false},
            {pattern: "scripts/dataApi/road/*.js", included: false},
            //{pattern: 'test/unit/*Spec.js', included: false},
            {pattern: 'test/unit/symbol.MatrixSpec.js', included: false},
            {pattern: 'test/unit/symbol.VectorSpec.js', included: false},
            {pattern: 'test/unit/symbol.PointSpec.js', included: false},
            {pattern: 'test/unit/symbol.LineSegmentSpec.js', included: false},
            {pattern: 'test/unit/symbol.LineStringSpec.js', included: false},
            {pattern: 'test/unit/symbol.SymbolFactorySpec.js', included: false},
            {pattern: 'test/unit/symbol.TemplateSpec.js', included: false},
            {pattern: 'test/unit/TileSpec.js', included: false},
            {pattern: 'test/unit/adLinkSpec.js', included: false},
            'test/unit/test-main.js'
        ],

        autoWatch: false,

        frameworks: ['jasmine', 'requirejs'],

        browsers: ['Chrome'],

        singleRun: false,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // 预处理配置，通常是代码覆盖率
        preprocessors: {
            'scripts/components/road/ctrls/*/*.js': ['coverage']
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