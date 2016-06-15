/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
	baseUrl: '../../../',
	paths: {
		// 第三方库
		'angular': 'scripts/libs/angularjs/1.4.4/angular',
		'jquery': 'scripts/libs/jquery/2.1.1/jquery-2.1.1',
		'ocLazyLoad': 'scripts/libs/ocLazyLoad/ocLazyLoad.require',
		'ngLayout': 'scripts/libs/ui-layout/ui-layout',
		'uiBootstrap': 'scripts/libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
		"chosenJquery": "scripts/libs/angular-chosen/chosen.jquery.min",
		"angularChosen": "scripts/libs/angular-chosen/angular-chosen.min",
		'fileUpload': 'scripts/libs/angular-file-upload/angular-file-upload',
		"angularDrag": "scripts/libs/angular-drag/angular-drag",
		"sweet-alert": "scripts/libs/sweet-alert-upgrade/sweetalert.min",
		"wheelZoom": "scripts/libs/wheelzoom/wheelzoom",
		'ngTable': 'scripts/libs/ng-table/ng-table',
		'ngSanitize':'scripts/libs/angularjs/1.4.4/angular-sanitize',
		// app相关
		'dataService': 'apps/poibase/service/dataService',
		'fccService': 'apps/imeep/service/dataService-fcc',
		'poiService': 'apps/poibase/service/dataService-poi',
		'metaService': 'apps/poibase/service/dataService-meta',
		'PoiEditorCtl': 'apps/imeep/editor/poiEditorCtl',
		'layers': "apps/poibase/editor/layerConfig",
	},
	shim: {
		'angular': {exports: 'angular'},
		'ngSanitize':['angular'],
		'ocLazyLoad': ['angular'],
		'ngLayout': ['angular'],
		'uiBootstrap': ['angular'],
		'chosenJquery': ['jquery'],
		'angularChosen': ['angular'],
		'fileUpload': ['angular'],
		'ngTable': ['angular'],
		'angularDrag': ['angular', 'jquery'],
		'dataService': ['angular', "sweet-alert"],
		'fccService':['dataService'],
		'poiService': ['dataService'],
		'metaService': ['dataService'],
		'PoiEditorCtl': ['ocLazyLoad', 'ngLayout', 'uiBootstrap', 'chosenJquery', 'angularChosen', 'fileUpload', 'angularDrag', 'sweet-alert', 'poiService', 'metaService', 'layers', 'wheelZoom', 'ngTable','ngSanitize','fccService'],
	}
});
// Start the main app logic.
requirejs(['PoiEditorCtl'], function () {
	angular.bootstrap(document.body, ['app']);
});