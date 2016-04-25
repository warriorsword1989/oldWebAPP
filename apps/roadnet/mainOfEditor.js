/**
 * Created by liwanchong on 2016/2/18.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'application':'../apps/roadnet/Application',
        'layers':"../apps/roadnet/layerconfig",
        'jquery': 'libs/jquery/2.1.1/jquery-2.1.1',
        'bootstrap':'libs/bootstrap-3.3.5/js/bootstrap',
        'angular': 'libs/angularjs/1.4.4/angular',
        'leaflet':'libs/leaflet-0.7.3/leaflet-src',
        'fastmap':"fastmap/fastmapapi",
        'appMain': '../apps/roadnet/appOfEditor',
        'ngLayout': 'libs/ui-layout/ui-layout',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
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
        'z-tree':'libs/z-tree/jquery.ztree.all',
        //'z-treeexcheck':'libs/z-tree/jquery.ztree.excheck',
        //'z-treeexedit':'libs/z-tree/jquery.ztree.exedit'
    },
    shim: {
        'bootstrap':['jquery'],
        'angular': ['jquery'],
        'ocLazyLoad': ['angular'],
        'ngLayout': ['angular'],
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
        //'z-treeexcheck':['jquery'],
        //'z-treeexedit':['jquery'],
        'appMain': ['ocLazyLoad','ngLayout','bootstrap', 'application','layers','applicationfuns','keyPressFunctions','bootspopover','bootstrapDatepicker','bootstrapDatepickerCN','timepicki','sweet-alert','poi-msg','e-smart-zoom','angular-route','uitree','uibootstrap','jqmin','z-tree']
    }
});

// Start the main app logic.
requirejs(['appMain'], function() {
    angular.bootstrap(document.body, ['mapApp']);
});


