/**
 * Created by liwanchong on 2016/2/18.
 */
requirejs.config({
    baseUrl: 'js/',
    paths: {
        'application':'Application',
        'layers':"layerconfig",
        'jquery': 'lib/jquery/2.1.1/jquery-2.1.1',
        'bootstrap':'lib/bootstrap-3.3.5/js/bootstrap',
        'angular': 'lib/angularjs/1.4.4/angular',
        'leaflet':'lib/leaflet-0.7.3/leaflet-src',
        'fastmap':"fastmap/fastmapapi",
        'appMain': 'appOfEditor',
        'ngLayout': 'lib/ui-layout/ui-layout',
        'ocLazyLoad': 'lib/ocLazyLoad/ocLazyLoad.require',
        'applicationfuns':'functions/appfunctions',
        'keyPressFunctions':'functions/keyPressFunctions',
        'bootspopover':'ctrl/popoverSelect',
        'timepicki':'lib/timepicki/js/timepicki',
        'bootstrapDatepicker':'lib/bootstrap-datepicker/js/bootstrap-datepicker',
        'bootstrapDatepickerCN':'lib/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN',
        'sweet-alert':'lib/sweet-alert/js/sweet-alert.min',
        'poi-msg':'lib/poi-msg/poiMsg',
        'e-smart-zoom':'lib/e-smart-zoom/js/e-smart-zoom-jquery.min'
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
        'appMain': ['ocLazyLoad','ngLayout','bootstrap', 'application','layers','applicationfuns','keyPressFunctions','bootspopover','bootstrapDatepicker','bootstrapDatepickerCN','timepicki','sweet-alert','poi-msg','e-smart-zoom']
    }
});

// Start the main app logic.
requirejs(['appMain'], function() {
    angular.bootstrap(document.body, ['mapApp']);
});


