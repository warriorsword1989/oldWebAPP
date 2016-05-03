/**
 * Created by liwanchong on 2016/2/18.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'application': 'uikits/Application',
        'appUtil': 'uikits/common/app-util',
        'mainEditorCtl': 'uikits/poibase/mainEditorCtl',
        'fastmap': 'fastmap/fastmap',
        'fm-util': 'fastmap/fastmap-util',
        'dataApi': 'dataApi/common/dataApi-ajax',
        'dataModel': 'dataApi/datamodel/common/DataModel',
        'geoDataModel': 'dataApi/datamodel/common/GeoDataModel',
        'ixPoiModel': 'dataApi/datamodel/poi/IxTest',
        'dataService': 'uikits/poibase/dataService-singleton',
        'poiService': 'uikits/poibase/dataService-angular'
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'uiBootstrap': ['angular'],
        'dataService': ['application', 'ixPoiModel'],
        'poiService': ['angular'],
        'fastmap': ['application'],
        'appUtil': ['application'],
        'fm-util': ['fastmap'],
        'dataModel': ['fastmap', 'fm-util'],
        'geoDataModel': ['dataModel'],
        'dataApi': ['fastmap'],
        'ixPoiModel': ['geoDataModel', 'dataApi'],
        'mainEditorCtl': ['ocLazyLoad', 'uiBootstrap', 'application', 'appUtil', 'ixPoiModel', 'dataService', 'poiService']
    }
});
// Start the main app logic.
requirejs(['mainEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});