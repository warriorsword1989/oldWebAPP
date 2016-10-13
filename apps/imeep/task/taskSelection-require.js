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
        "highstock": "scripts/libs/highcharts-ng/dist/highStock",
        "3dchartsPlugin":"scripts/libs/highcharts-ng/dist/3dplugins",
        'uiBootstrap': 'scripts/libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        // app相关
        'dataService': 'apps/imeep/service/dataService',
        'manService': 'apps/imeep/service/dataService-manage',
        'TaskSelectionCtl': 'apps/imeep/task/taskSelectionCtl',
        'TaskSelectionNewCtl': 'apps/imeep/task/taskSelectionNewCtl',
        'layers': "apps/imeep/task/layerConfig",
    },
    waitSeconds: 0,
    shim: {
        'ngLayout': ['angular'],
        'ngCookies': ['angular'],
        'dataService': ['angular', "sweet-alert"],
        'manService': ['dataService'],
        'highcharts': ['angular'],
        'uiBootstrap':['angular'],
        '3dchartsPlugin':['highcharts','highstock'],
        'TaskSelectionCtl': ['ngLayout', 'manService','layers', 'ngCookies','highcharts','3dchartsPlugin','highstock','uiBootstrap'],
        'TaskSelectionNewCtl': ['ngLayout', 'manService', 'ngCookies','uiBootstrap'],
    }
});
// Start the main app logic.
var temp = location.href.split('?')[0].substr(location.href.split('?')[0].lastIndexOf('/')+1)=='taskPage.html'?'TaskSelectionNewCtl':'TaskSelectionCtl'
requirejs([temp], function() {
    angular.bootstrap(document.body, ['app']);
});