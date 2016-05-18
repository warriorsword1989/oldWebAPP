/**
 * Created by mali on 2016/5/5.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'application': 'uikits/Application',
        'appUtil': 'uikits/common/app-util',
        'projectManageCtl': 'uikits/poibase/projectManageCtl',
        'fastmap': 'fastmap/fastmap',
        'fm-util': 'fastmap/fastmap-util',
        'dataApi': 'dataApi/common/dataApi-ajax',
        'dataModel': 'dataApi/common/DataModel',
        'dataService': 'uikits/poibase/dataService-singleton',
        'poiService': 'uikits/poibase/dataService-poi',
        'metaService': 'uikits/poibase/dataService-meta',
        'ngTable':'libs/ng-table/ng-table',
        'ngSanitize':'libs/angularjs/1.4.4/angular-sanitize'
    },
    shim: {
        'angular':{exports:'angular'},                   //ngTable需要用angular的名字;
        'ocLazyLoad': ['angular'],
        'uiBootstrap': ['angular'],
        'poiService': ['angular'],
        'metaService': ['angular'],
        'fastmap': ['application'],
        'appUtil': ['application'],
        'select2':['jquery'],
        'ngTable':['angular'],
        'ngSanitize':['angular'],
        'dataApi':['fastmap'],
        'projectManageCtl': ['ocLazyLoad' ,'uiBootstrap', 'application', 'appUtil', 'poiService','metaService','ngTable','ngSanitize','dataApi']
    }
});
// Start the main app logic.
requirejs(['projectManageCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});