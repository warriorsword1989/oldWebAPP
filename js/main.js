/**
 * Created by liwanchong on 2015/9/21.
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
        'fastmap':"fastmap/fastmapapi",
        'lodash':'lib/lodash/lodash',
        'test': 'app',
        'ngLayout': 'lib/ui-layout/ui-layout',
        'smart-table':'lib/smart-table/smart-table',
        'ocLazyLoad': 'lib/ocLazyLoad/ocLazyLoad.require',
        'applicationfuns':'functions/appfunctions',
        'keyPressFunctions':'functions/keyPressFunctions',
        'bootspopover':'popoverSelect'
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
        'test': ['ocLazyLoad','ngLayout','smart-table','bootstrap','select2', 'application','layers','applicationfuns','keyPressFunctions','bootspopover']
    }
});

// Start the main app logic.
requirejs(['test'], function() {
    angular.bootstrap(document.body, ['mapApp']);
});

