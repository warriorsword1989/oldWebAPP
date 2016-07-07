/**
 * Created by mali on 2016/6/8.
 */
requirejs.config({
    baseUrl: '../../../',
    paths: {
        // 第三方库
        'angular': 'scripts/libs/angularjs/1.4.4/angular',
        'ngCookies': 'scripts/libs/angularjs/1.4.4/angular-cookies.min',
        'ngLayout': 'scripts/libs/ui-layout/ui-layout',
        "sweet-alert": "scripts/libs/sweet-alert-upgrade/sweetalert.min",
        "highcharts": "scripts/libs/highcharts-ng/dist/highcharts-ng",
        "highstock": "http://code.highcharts.com/stock/highstock.src",
        "3dchartsPlugin":"http://code.highcharts.com/highcharts-3d",
        // app相关
        'dataService': 'apps/imeep/service/dataService',
        'manService': 'apps/imeep/service/dataService-manage',
        'TaskSelectionCtl': 'apps/imeep/task/taskSelectionCtl',
        'layers': "apps/imeep/task/layerConfig",
    },
    shim: {
        'ngLayout': ['angular'],
        'ngCookies': ['angular'],
        'dataService': ['angular', "sweet-alert"],
        'manService': ['dataService'],
        'highcharts': {
            exports: 'angular',
            deps:['angular']
        },
        '3dchartsPlugin':['highcharts'],
        'TaskSelectionCtl': ['ngLayout', 'manService', 'layers', 'ngCookies','highcharts','3dchartsPlugin','highstock']
    }
});
// Start the main app logic.
requirejs(['TaskSelectionCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});