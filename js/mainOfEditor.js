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
        'select2':'lib/select2/4.0.0/js/select2',
        'iCheckBox':'lib/icheck-1.x/icheck',
        'fastmap':"fastmap/fastmapapi",
        'lodash':'lib/lodash/lodash',
        'test': 'appOfEditor',
        'ngLayout': 'lib/ui-layout/ui-layout',
        'smart-table':'lib/smart-table/smart-table',
        'ocLazyLoad': 'lib/ocLazyLoad/ocLazyLoad.require',
        'applicationfuns':'functions/appfunctions',
        'keyPressFunctions':'functions/keyPressFunctions',
        'bootspopover':'ctrl/popoverSelect',
        'timepicki':'lib/timepicki/js/timepicki',
        'bootstrapDatepicker':'lib/bootstrap-datepicker/js/bootstrap-datepicker',
        'bootstrapDatepickerCN':'lib/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN',
        'sweet-alert':'lib/sweet-alert/js/sweet-alert.min',
        'poi-msg':'lib/poi-msg/poiMsg'
    },
    shim: {
        'bootstrap':['jquery'],
        'angular': ['jquery'],
        'select2':['jquery'],
        'ocLazyLoad': ['angular'],
        'ngLayout': ['angular'],
        'smart-table':['angular'],
        'applicationfuns':['application'],
        'keyPressFunctions':['jquery','applicationfuns'],
        'bootspopover':['jquery'],
        'bootstrapDatepicker':['jquery','bootstrap'],
        'bootstrapDatepickerCN':['bootstrapDatepicker'],
        'timepicki':['jquery','angular'],
        'iCheckBox':['jquery'],
        'sweet-alert':['jquery'],
        'poi-msg':['jquery'],
        'test': ['ocLazyLoad','ngLayout','smart-table','bootstrap','select2', 'application','layers','applicationfuns','keyPressFunctions','bootspopover','bootstrapDatepicker','bootstrapDatepickerCN','timepicki','iCheckBox','sweet-alert','poi-msg']
    }
});

// Start the main app logic.
requirejs(['test'], function() {
    angular.bootstrap(document.body, ['mapApp']);
});


