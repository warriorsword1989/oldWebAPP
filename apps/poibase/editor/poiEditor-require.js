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

        // 'roadApplication':'../apps/roadnet/Application',
        'layers':"../apps/poibase/editor/layerconfigNew-poi",
        'bootstrap':'libs/bootstrap-3.3.5/js/bootstrap',
        'fastmap':"fastmap/fastmapapi",
        'appMain': '../apps/roadnet/appOfEditor',
        'applicationfuns':'uikits/road/appfunctions',
        'keyPressFunctions':'uikits/road/keyPressFunctions',
        'bootspopover':'utils/popoverSelect',
        'timepicki':'libs/timepicki/js/timepicki',
        'bootstrapDatepicker':'libs/bootstrap-datepicker/js/bootstrap-datepicker',
        'bootstrapDatepickerCN':'libs/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN',
        'sweet-alert':'libs/sweet-alert/js/sweet-alert.min',
        'poi-msg':'libs/poi-msg/poiMsg',
        'e-smart-zoom':'libs/e-smart-zoom/js/e-smart-zoom-jquery.min',
        'angular-route':'libs/angularjs/1.4.4/angular-route.min',
        'uitree':'libs/ui-tree/angular-ui-tree',
        'uibootstrap':'libs/ui-tree/ui-bootstrap-tpls',
        'jqmin':'libs/jquery/2.1.1/jquery-2.1.1.min',
        'z-tree':'libs/z-tree/jquery.ztree.all'

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

        'bootstrap':['jquery'],
        'angular': ['jquery'],
        'layers':['application'],
        'applicationfuns':['application'],
        'keyPressFunctions':['jquery','applicationfuns'],
        'bootspopover':['jquery'],
        'bootstrapDatepicker':['jquery','bootstrap'],
        'bootstrapDatepickerCN':['bootstrapDatepicker'],
        'timepicki':['jquery','angular'],
        'sweet-alert':['jquery'],
        'poi-msg':['jquery'],
        'e-smart-zoom':['jquery'],
        'angular-route':['angular'],
        'uitree':['angular'],
        'uibootstrap':['angular'],
        'z-tree':['jquery'],
        'metaService': ['dataService'],

        'PoiEditorCtl': ['ocLazyLoad', 'ngLayout', 'uiBootstrap','bootstrap', 'chosenJquery', 'angularChosen', 'application', 'appUtil', 'poiService','metaService','fileUpload','angularDrag','layers','bootspopover','sweet-alert','poi-msg','e-smart-zoom','angular-route','uitree','jqmin','z-tree'],
    }
});
// Start the main app logic.
requirejs(['PoiEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});