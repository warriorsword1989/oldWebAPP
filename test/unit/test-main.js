/**
 * Created by xujie on 2016/5/4 0004.
 */
var TEST_REGEXP = /(spec|test)\.js$/i;
var allTestFiles = [];

// Get a list of all the test files to include
for (var file in window.__karma__.files) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
}
require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base',

    // example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
    paths: {
        'jquery': "scripts/libs/jquery/2.1.1/jquery-2.1.1",
        'angular': "scripts/libs/angularjs/1.4.4/angular",
        'angularMocks': "scripts/libs/angularjs/1.4.4/angular-mocks",
        'ocLazyLoad': "scripts/libs/ocLazyLoad/ocLazyLoad.require",
        'uiLayout': "scripts/libs/ui-layout/ui-layout",
        'leaflet': "scripts/libs/leaflet-0.7.3/leaflet-src",
        'libs': "'test/libs",
        'mainApp': "apps/roadnet/appOfEditor"
    },

    // example of using a shim, to load non AMD libraries (such as underscore)
    shim: {
        'angular': {deps: ['jquery'],'exports': 'angular'},
        'angularMocks': {deps: ['angular'], 'exports': 'angular.mock'},
        'ocLazyLoad':['angular'],
        'uiLayout':['angular'],
        'leaflet': {'exports': 'leaflet'},
        'libs': ['leaflet'],
        'mainApp': ['angular', 'leaflet', 'ocLazyLoad','uiLayout']
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});

require([
        'angular',
        'mainApp'
    ], function (angular) {
        angular.element().ready(function () {
            // bootstrap the app manually
            angular.bootstrap(document, ['mapApp']);
        });
    }
);
