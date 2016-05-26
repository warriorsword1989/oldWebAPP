/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../../',
    paths: {
        'angular': 'scripts/libs/angularjs/1.4.4/angular',
        'jquery': 'scripts/libs/jquery/2.1.1/jquery-2.1.1',
        'ocLazyLoad': 'scripts/libs/ocLazyLoad/ocLazyLoad.require',
        'ngLayout': 'scripts/libs/ui-layout/ui-layout',
        'uiBootstrap': 'scripts/libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'leaflet': 'scripts/libs/leaflet-0.7.3/leaflet-src',
        "chosenJquery": "scripts/libs/angular-chosen/chosen.jquery.min",
        "angularChosen": "scripts/libs/angular-chosen/angular-chosen.min",
        'application': 'scripts/uikits/Application',
        'appUtil': 'scripts/uikits/common/app-util',
        'dataService': 'scripts/uikits/poibase/dataService',
        'poiService': 'scripts/uikits/poibase/dataService-poi',
        'metaService': 'scripts/uikits/poibase/dataService-meta',
        'fileUpload':'scripts/libs/angular-file-upload/angular-file-upload',
        "angularDrag":"scripts/libs/angular-drag/angular-drag",
        'PoiEditorCtl': 'apps/poibase/editor/poiEditorCtl',
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'ngLayout': ['angular'],
        'uiBootstrap': ['angular'],
        'chosenJquery': ['jquery'],
        'angularChosen': ['angular'],
        'appUtil': ['application'],
        'dataService': ['angular'],
        'fileUpload':['angular'],
        'angularDrag':['angular','jquery'],
        'poiService': ['dataService'],
        'metaService': ['dataService'],
        'PoiEditorCtl': ['ocLazyLoad', 'ngLayout', 'uiBootstrap', 'leaflet', 'chosenJquery', 'angularChosen', 'application', 'appUtil', 'poiService','metaService','fileUpload','angularDrag']
    }
});
// Start the main app logic.
requirejs(['PoiEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});