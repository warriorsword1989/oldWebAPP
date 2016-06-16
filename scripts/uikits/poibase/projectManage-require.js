/**
 * Created by mali on 2016/5/5.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'ngCookies': 'libs/angularjs/1.4.4/angular-cookies.min',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'application': 'uikits/Application',
        'projectManageCtl': 'uikits/poibase/projectManageCtl',
        'fastmap': 'fastmap/fastmap',
        'fm-util': 'fastmap/fastmap-util',
        'dataModel': 'dataApi/common/DataModel',
        'dataService': 'uikits/poibase/dataService',
        'poiService': 'uikits/poibase/dataService-poi',
        'metaService': 'uikits/poibase/dataService-meta',
        'ngTable': 'libs/ng-table/ng-table',
        'ngSanitize': 'libs/angularjs/1.4.4/angular-sanitize'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }, //ngTable需要用angular的名字;
        'ngCookies': ['angular'],
        'ocLazyLoad': ['angular'],
        'uiBootstrap': ['angular'],
        'dataService': ['angular'],
        'poiService': ['dataService'],
        'metaService': ['dataService'],
        'fastmap': ['application'],
        'select2': ['jquery'],
        'ngTable': ['angular'],
        'ngSanitize': ['angular'],
        'projectManageCtl': ['ocLazyLoad', 'uiBootstrap', 'application', 'poiService', 'metaService', 'ngTable', 'ngSanitize', 'ngCookies']
    }
});
// Start the main app logic.
requirejs(['projectManageCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});