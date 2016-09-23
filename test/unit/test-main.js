/**
 * Created by xujie on 2016/5/4 0004.
 */
var TEST_REGEXP = /(spec|test)\.js$/i;
var allTestFiles = [];

// Get a list of all the test files to include
for (var file in window.__karma__.files) {
    if (!window.__karma__.files.hasOwnProperty(file)) {
        continue;
    }

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
        'sweatAlert': "scripts/libs/sweet-alert/js/sweet-alert.min",
        'angular': "scripts/libs/angularjs/1.4.4/angular",
        'angularMocks': "scripts/libs/angularjs/1.4.4/angular-mocks",
        'ocLazyLoad': "scripts/libs/ocLazyLoad/ocLazyLoad.require",
        'uiLayout': "scripts/libs/ui-layout/ui-layout",
        'leaflet': "scripts/libs/leaflet-0.7.3/leaflet-src",
        'fastmap': 'scripts/mapApi/fastmap',
        'Application': "apps/roadnet/Application",
        'appfunctions': "scripts/uikits/road/appfunctions",
        'mainApp': "apps/roadnet/appOfEditor",
        'rdCrossCtrl': "scripts/components/road/ctrls/attr_cross_ctrl/rdCrossCtrl",
        'symbol.Matrix': 'scripts/mapApi/symbol/Matrix',
        'symbol.Vector': 'scripts/mapApi/symbol/Vector',
        'symbol.Point': 'scripts/mapApi/symbol/Point',
        'symbol.LineSegment': 'scripts/mapApi/symbol/LineSegment',
        'symbol.LineString': 'scripts/mapApi/symbol/LineString',
        'symbol.Template': 'scripts/mapApi/symbol/Template',
        'symbol.CirclePointSymbol': 'scripts/mapApi/symbol/CirclePointSymbol',
        'symbol.SolidCirclePointSymbol': 'scripts/mapApi/symbol/SolidCirclePointSymbol',
        'symbol.SquarePointSymbol': 'scripts/mapApi/symbol/SquarePointSymbol',
        'symbol.SolidSquarePointSymbol': 'scripts/mapApi/symbol/SolidSquarePointSymbol',
        'symbol.CrossPointSymbol': 'scripts/mapApi/symbol/CrossPointSymbol',
        'symbol.TiltedCrossPointSymbol': 'scripts/mapApi/symbol/TiltedCrossPointSymbol',
        'symbol.PicturePointSymbol': 'scripts/mapApi/symbol/PicturePointSymbol',
        'symbol.CompositePointSymbol': 'scripts/mapApi/symbol/CompositePointSymbol',
        'symbol.SampleLineSymbol': 'scripts/mapApi/symbol/SampleLineSymbol',
        'symbol.CartoLineSymbol': 'scripts/mapApi/symbol/CartoLineSymbol',
        'symbol.MarkerLineSymbol': 'scripts/mapApi/symbol/MarkerLineSymbol',
        'symbol.HashLineSymbol': 'scripts/mapApi/symbol/HashLineSymbol',
        'symbol.CompositeLineSymbol': 'scripts/mapApi/symbol/CompositeLineSymbol',
        'symbol.SymbolsFile': 'scripts/mapApi/symbol/SymbolsFile',
        'symbol.SymbolFactory': 'scripts/mapApi/symbol/SymbolFactory',
        'mapApi.AdLink':'scripts/dataApi/road/AdLink',
        'mapApi.GeoDataModel':'scripts/dataApi/road/GeoDataModel',
        'mapApi.Tile':'scripts/mapApi/Tile'
    },

    // example of using a shim, to load non AMD libraries (such as underscore)
    shim: {
        'angular': {deps: ['jquery'], exports: 'angular'},
        'sweatAlert': ['jquery'],
        'angularMocks': {deps: ['angular'], exports: 'angular.mock'},
        'ocLazyLoad': ['angular'],
        'uiLayout': ['angular'],
        'leaflet': {exports: 'leaflet'},
        'libs': ['leaflet', 'Application'],
        'fastmap': {exports: 'fastmap'},
        'Application': {exports: 'Application'},
        'appfunctions': {deps: ['Application', 'libs'], exports: 'appfunctions'},
        'mainApp': ['angular', 'ocLazyLoad', 'uiLayout', 'libs'],
        'rdCrossCtrl': ['angular', 'mainApp', 'appfunctions', 'sweatAlert'],
        'symbol.Matrix': {deps: ['fastmap', 'leaflet']},
        'symbol.Vector': {deps: ['fastmap', 'leaflet', 'symbol.Matrix']},
        'symbol.Point': {deps: ['fastmap', 'leaflet', 'symbol.Matrix', 'symbol.Vector']},
        'symbol.LineSegment': {deps: ['fastmap', 'leaflet', 'symbol.Point']},
        'symbol.LineString': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineSegment']},
        'symbol.Template': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString', 'symbol.LineSegment']},
        'symbol.CirclePointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.SolidCirclePointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.SquarePointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.SolidSquarePointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.CrossPointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.TiltedCrossPointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.PicturePointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.CompositePointSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Point', 'symbol.LineString']},
        'symbol.SampleLineSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Template']},
        'symbol.CartoLineSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Template']},
        'symbol.MarkerLineSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Template']},
        'symbol.HashLineSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Template']},
        'symbol.CompositeLineSymbol': {deps: ['fastmap', 'leaflet', 'symbol.Template']},
        'mapApi.Tile':{deps: ['fastmap', 'leaflet']},
        'symbol.SymbolsFile': {deps: ['fastmap']},
        'mapApi.AdLink':{deps: [ 'mapApi.GeoDataModel']},
        'mapApi.GeoDataModel':{deps: ['fastmap', 'leaflet']},
        'symbol.SymbolFactory': {
            deps: ['symbol.CirclePointSymbol',
                'symbol.SolidCirclePointSymbol',
                'symbol.SquarePointSymbol',
                'symbol.SolidSquarePointSymbol',
                'symbol.CrossPointSymbol',
                'symbol.TiltedCrossPointSymbol',
                'symbol.PicturePointSymbol',
                'symbol.CompositePointSymbol',
                'symbol.SampleLineSymbol',
                'symbol.CartoLineSymbol',
                'symbol.MarkerLineSymbol',
                'symbol.HashLineSymbol',
                'symbol.CompositeLineSymbol',
                'symbol.SymbolsFile'
            ]
        }
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start,

    waitSeconds: 0
});
