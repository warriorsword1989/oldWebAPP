/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../../',
    paths: {
        // 第三方库
        'angular': 'scripts/libs/angularjs/1.4.4/angular',
        'jquery': 'scripts/libs/jquery/2.1.1/jquery-2.1.1',
        'bootstrap': 'scripts/libs/bootstrap-3.3.5/js/bootstrap',
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
        'ngSanitize': 'scripts/libs/angularjs/1.4.4/angular-sanitize',
        'bootstrapDatepicker': 'scripts/libs/bootstrap-datepicker/js/bootstrap-datepicker',
        'bootstrapDatepickerCN': 'scripts/libs/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN',
        'poi-msg':'scripts/libs/poi-msg/poiMsg',
        // app相关
        'dataService': 'apps/imeep/service/dataService',
        'metaService': 'apps/imeep/service/dataService-meta',
        'fccService': 'apps/imeep/service/dataService-fcc',
        'columnService': 'apps/imeep/service/dataService-column',
        'manService': 'apps/imeep/service/dataService-manage',
        'ColEditorCtl': 'apps/imeep/colEditor/colEditorCtl',
        'fastmapUikit': 'scripts/components/directives/fastmap-uikit',
        'fmEditView': 'scripts/components/directives/fmEditView/fmEditView',
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'ngSanitize': ['angular'],
        'ocLazyLoad': ['angular'],
        'ngLayout': ['angular'],
        'uiBootstrap': ['angular'],
        'bootstrap': ['jquery'],
        'chosenJquery': ['jquery'],
        'angularChosen': ['angular'],
        'fileUpload': ['angular'],
        'ngTable': ['angular'],
        'angularDrag': ['angular', 'jquery'],
        'poi-msg':['jquery'],
        'dataService': ['angular', "sweet-alert"],
        'metaService': ['dataService'],
        'fccService': ['dataService'],
        'columnService': ['dataService'],
        'manService': ['dataService'],
        'bootstrapDatepicker': ['jquery', 'bootstrap'],
        'bootstrapDatepickerCN': ['bootstrapDatepicker'],
        //'bootspopover': ['jquery'],
        'keyPressFunctions': ['jquery', 'dataService', 'metaService', 'editService'],
        'fastmapUikit': ['angular'],
        'fmEditView': ['fastmapUikit'],
        'fmBindCompiledHtml': ['fastmapUikit'],
        'ColEditorCtl': ['ocLazyLoad', 'jquery', 'ngLayout', 'uiBootstrap', 'chosenJquery', 'angularChosen', 'fileUpload', 'angularDrag', 'sweet-alert', 'metaService', 'fccService', 'columnService', 'manService','ngTable', 'ngSanitize','bootstrapDatepickerCN','poi-msg','fastmapUikit','fmEditView']
    }
});
// Start the main app logic.
requirejs(['ColEditorCtl'], function() {
    angular.bootstrap(document.body, ['app']);
});