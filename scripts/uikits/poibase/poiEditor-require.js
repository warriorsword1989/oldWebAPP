/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'jquery': 'libs/jquery/2.1.1/jquery-2.1.1',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'ngLayout': 'libs/ui-layout/ui-layout',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'leaflet': 'libs/leaflet-0.7.3/leaflet-src',
        "chosenJquery": "libs/angular-chosen/chosen.jquery.min",
        "angularChosen": "libs/angular-chosen/angular-chosen.min",
        'application': 'uikits/Application',
        'dataService': 'uikits/poibase/dataService',
        'poiService': 'uikits/poibase/dataService-poi',
        'PoiEditorCtl': 'uikits/poibase/poiEditorCtl'
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'ngLayout': ['angular'],
        'uiBootstrap': ['angular'],
        'chosenJquery': ['jquery'],
        'angularChosen': ['angular'],
        'dataService': ['angular'],
        'poiService': ['dataService'],
        'PoiEditorCtl': ['ocLazyLoad', 'ngLayout', 'uiBootstrap', 'leaflet', 'chosenJquery', 'angularChosen', 'application', 'poiService']
    }
});
// Start the main app logic.
requirejs(['PoiEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});