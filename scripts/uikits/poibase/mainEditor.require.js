/**
 * Created by liwanchong on 2016/2/18.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'application': 'uikits/common/Application',
        'mainEditorCtl': 'uikits/poibase/mainEditorCtl',
        'fastmap': 'uikits/common/fastmap',
        'geoDataModel': 'dataApi/datamodel/poi/GeoDataModel',
        'ixPoiModel': 'dataApi/datamodel/poi/IxPoi',
        'IxPoiContact': 'dataApi/poi/IxPoiContact',
        'dataService': 'uikits/poibase/appDataService'
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'uiBootstrap': ['angular'],
        'dataService': ['application', 'ixPoiModel'],
        'fastmap': ['application'],
        'geoDataModel': ['fastmap'],
        'ixPoiModel': ['geoDataModel'],
        'IxPoiContact': ['geoDataModel'],
        'mainEditorCtl': ['ocLazyLoad', 'uiBootstrap', 'application', 'ixPoiModel', 'dataService','IxPoiContact']
    }
});
// Start the main app logic.
requirejs(['mainEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});