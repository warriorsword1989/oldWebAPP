/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'application': 'uikits/Application',
        'appUtil': 'uikits/common/app-util',
        'mainEditorCtl': 'uikits/poibase/mainEditorCtl',
        'poiService': 'uikits/poibase/dataService-angular',
        'select2':'libs/select2/js/select2',
        'jquery':'libs/jquery/2.1.1/jquery-2.1.1',
        'leaflet':'libs/leaflet-0.7.3/leaflet-src',
        'leafletUtil':'fastmap/leaflet-poiUtil',
        "chosenJquery":"libs/angular-chosen/chosen.jquery.min",
        "angularChosen":"libs/angular-chosen/angular-chosen.min",
        'fileUpload':'libs/angular-file-upload/angular-file-upload'
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'uiBootstrap': ['angular'],
        'poiService': ['angular'],
        'fastmap': ['application'],
        'appUtil': ['application'],
        'select2':['jquery'],
        'leafletUtil':['leaflet'],
        'chosenJquery':['jquery'],
        'angularChosen':['angular'],
        'fileUpload':['angular'],
        'mainEditorCtl': ['ocLazyLoad', 'uiBootstrap', 'application', 'appUtil', 'poiService','select2','leafletUtil','chosenJquery','angularChosen','fileUpload']
    }
});
// Start the main app logic.
requirejs(['mainEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});