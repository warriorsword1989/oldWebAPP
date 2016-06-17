/**
 * Created by mali on 2016/6/8.
 */
requirejs.config({
    baseUrl: '../../../',
    paths: {
        // 第三方库
        'angular': 'scripts/libs/angularjs/1.4.4/angular',
        'jquery': 'scripts/libs/jquery/2.1.1/jquery-2.1.1',
        'ngCookies':'scripts/libs/angularjs/1.4.4/angular-cookies.min',
        'ocLazyLoad': 'scripts/libs/ocLazyLoad/ocLazyLoad.require',
        'ngLayout': 'scripts/libs/ui-layout/ui-layout',
        'uiBootstrap': 'scripts/libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        "chosenJquery": "scripts/libs/angular-chosen/chosen.jquery.min",
        // app相关
        'dataService': 'apps/imeep/service/dataService',
        'poiService': 'apps/imeep/service/dataService-poi',
        'metaService': 'apps/imeep/service/dataService-meta',
        'TaskSelectionCtl': 'apps/imeep/task/taskSelectionCtl',
        'layers': "apps/imeep/task/layerConfig",
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'ngLayout': ['angular'],
        'uiBootstrap': ['angular'],
        'chosenJquery': ['jquery'],
        'ngCookies': ['angular'],
        'dataService': ['angular'],
        'poiService': ['dataService'],
        'TaskSelectionCtl': ['ocLazyLoad', 'ngLayout', 'uiBootstrap', 'chosenJquery', 'poiService', 'layers','ngCookies']
    }
});
// Start the main app logic.
requirejs(['TaskSelectionCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});