/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'jquery': 'libs/jquery/2.1.1/jquery-2.1.1',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'ngLayout': 'libs/ui-layout/ui-layout',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        // 'leaflet': 'libs/leaflet-0.7.3/leaflet-src',
        "chosenJquery": "libs/angular-chosen/chosen.jquery.min",
        "angularChosen": "libs/angular-chosen/angular-chosen.min",
        'application': '../apps/poibase/Application',
        'appUtil': 'uikits/common/app-util',
        'dataService': 'uikits/poibase/dataService',
        'poiService': 'uikits/poibase/dataService-poi',
        'PoiEditorCtl': '../apps/poibase/editor/poiEditorCtl',

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

        'PoiEditorCtl': ['ocLazyLoad', 'ngLayout', 'uiBootstrap','bootstrap', 'chosenJquery', 'angularChosen', 'application', 'appUtil', 'poiService','layers','bootspopover','sweet-alert','poi-msg','e-smart-zoom','angular-route','uitree','jqmin','z-tree'],

    }
});
// Start the main app logic.
requirejs(['PoiEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});