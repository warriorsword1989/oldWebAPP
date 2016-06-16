/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../scripts/',
    paths: {
        'angular': 'libs/angularjs/1.4.4/angular',
        'ocLazyLoad': 'libs/ocLazyLoad/ocLazyLoad.require',
        'uiBootstrap': 'libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        'application': 'uikits/Application',
        'mainEditorCtl': 'uikits/poibase/mainEditorCtl',
        'dataService': 'uikits/poibase/dataService',
        'poiService': 'uikits/poibase/dataService-poi',
        'metaService': 'uikits/poibase/dataService-meta',
        'select2': 'libs/select2/js/select2',
        'jquery': 'libs/jquery/2.1.1/jquery-2.1.1',
        // 'leaflet':'libs/leaflet-0.7.3/leaflet-src',
        // 'leafletUtil':'fastmap/leaflet-poiUtil',
        // 'navBar':'libs/leaflet-0.7.3/plugins/Leaflet.NavBar',
        // 'feature':'libs/leaflet-0.7.3/plugins/draw/Draw.Feature',
        // 'marker':'libs/leaflet-0.7.3/plugins/draw/Draw.Marker',
        // 'polyline':'libs/leaflet-0.7.3/plugins/draw/Draw.Polyline',
        // 'polygon':'libs/leaflet-0.7.3/plugins/draw/Draw.Polygon',
        // 'rectangle':'libs/leaflet-0.7.3/plugins/draw/Draw.Rectangle',
        // 'toolbarDraw':'libs/leaflet-0.7.3/plugins/draw/DrawToolbar',
        // 'geoUtil':'libs/leaflet-0.7.3/plugins/draw/GeometryUtil',
        // 'latlngUtil':'libs/leaflet-0.7.3/plugins/draw/LatLngUtil',
        // 'leafletDraw':'libs/leaflet-0.7.3/plugins/draw/Leaflet.draw',
        // 'lineUtil':'libs/leaflet-0.7.3/plugins/draw/LineUtil.Intersect',
        // 'gonUtil':'libs/leaflet-0.7.3/plugins/draw/Polygon.Intersect',
        // 'polylineUtil':'libs/leaflet-0.7.3/plugins/draw/Polyline.Intersect',
        // 'toolbar':'libs/leaflet-0.7.3/plugins/Toolbar',
        // 'tooltip':'libs/leaflet-0.7.3/plugins/Tooltip',
        "chosenJquery": "libs/angular-chosen/chosen.jquery.min",
        "angularChosen": "libs/angular-chosen/angular-chosen.min",
        'fileUpload': 'libs/angular-file-upload/angular-file-upload',
        "angularDrag": "libs/angular-drag/angular-drag",
        "fastmapUikit": "components/directives/fastmap-uikit",
        "showBox": "components/directives/showBox/showBox",
        'sweet-alert': 'libs/sweet-alert/js/sweet-alert.min',
    },
    shim: {
        'ocLazyLoad': ['angular'],
        'uiBootstrap': ['angular'],
        'dataService': ['angular'],
        'poiService': ['dataService'],
        'metaService': ['dataService'],
        'fastmap': ['application'],
        'select2': ['jquery'],
        // 'leafletUtil':['leaflet'],
        // 'navBar':['leaflet','leafletUtil'],
        // "draw":['leaflet','feature','marker','polyline','polygon','rectangle','toolbarDraw','geoUtil','latlngUtil','leafletDraw','lineUtil','gonUtil','polylineUtil','toolbar','tooltip'],
        'chosenJquery': ['jquery'],
        'angularChosen': ['angular'],
        'fileUpload': ['angular'],
        'angularDrag': ['angular', 'jquery'],
        'fastmapUikit': ['angular'],
        'showBox': ['fastmapUikit'],
        'sweet-alert': ['jquery'],
        'mainEditorCtl': ['ocLazyLoad', 'uiBootstrap', 'application', 'poiService', 'metaService', 'select2', 'chosenJquery', 'angularChosen', 'fileUpload', 'angularDrag', 'showBox', 'sweet-alert']
    }
});
// Start the main app logic.
requirejs(['mainEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});