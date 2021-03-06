/**
 * modified by liuyang on 2016/05/04.
 */
requirejs.config({
    baseUrl: '../../../',
    paths: {
        // 第三方库
        angular: 'scripts/libs/angularjs/1.4.4/angular',
        ngCookies: 'scripts/libs/angularjs/1.4.4/angular-cookies.min',
        jquery: 'scripts/libs/jquery/2.1.1/jquery-2.1.1',
        select2: 'scripts/libs/select2/js/select2',
        bootstrap: 'scripts/libs/bootstrap-3.3.5/js/bootstrap',
        ocLazyLoad: 'scripts/libs/ocLazyLoad/ocLazyLoad.require',
        ngLayout: 'scripts/libs/ui-layout/ui-layout',
        uiBootstrap: 'scripts/libs/bootstrap-3.3.5/js/ui-bootstrap-tpls-1.3.2',
        chosenJquery: 'scripts/libs/angular-chosen/chosen.jquery.min',
        angularChosen: 'scripts/libs/angular-chosen/angular-chosen',
        fileUpload: 'scripts/libs/angular-file-upload/angular-file-upload',
        angularDrag: 'scripts/libs/angular-drag/angular-drag',
        'sweet-alert': 'scripts/libs/sweet-alert-upgrade/sweetalert.min',
        wheelZoom: 'scripts/libs/wheelzoom/wheelzoom',
        ngTable: 'scripts/libs/ng-table/ng-table',
        ngSanitize: 'scripts/libs/angularjs/1.4.4/angular-sanitize',
        timepicki: 'scripts/libs/timepicki/js/timepicki',
        bootstrapDatepicker: 'scripts/libs/bootstrap-datepicker/js/bootstrap-datepicker',
        bootstrapDatepickerCN: 'scripts/libs/bootstrap-datepicker/js/locales/bootstrap-datepicker.zh-CN',
        'e-smart-zoom': 'scripts/libs/e-smart-zoom/js/e-smart-zoom-jquery.min',
        bootspopover: 'scripts/utils/popoverSelect',
        treeControl: 'scripts/libs/angular-tree-control/angular-tree-control',
        'poi-msg': 'scripts/libs/poi-msg/poiMsg',
        hotkey: 'scripts/libs/angular-hotkey/hotkeys',
        // app相关
        dataService: 'apps/imeep/service/dataService',
        metaService: 'apps/imeep/service/dataService-meta',
        fccService: 'apps/imeep/service/dataService-fcc',
        editService: 'apps/imeep/service/dataService-edit',
        manService: 'apps/imeep/service/dataService-manage',
        EditorCtl: 'apps/imeep/editor/editorCtl',
        layers: 'apps/imeep/editor/layerConfig',
        keyPressFunctions: 'apps/imeep/editor/hotKeyEvent',
        'z-tree': 'scripts/libs/z-tree/jquery.ztree.all',
        fastmapUikit: 'scripts/components/directives/fastmap-uikit',
        fmEditView: 'scripts/components/directives/fmEditView/fmEditView',
        langcodeFilter: 'scripts/components/filter/langCodeFilter'
    },
    // urlArgs: 'bust=' + (new Date()).getTime(),
    waitSeconds: 0,
    shim: {
        angular: {
            exports: 'angular'
        },
        ngSanitize: ['angular'],
        ngCookies: ['angular'],
        ocLazyLoad: ['angular'],
        ngLayout: ['angular'],
        uiBootstrap: ['angular'],
        bootstrap: ['jquery'],
        chosenJquery: ['jquery'],
        angularChosen: ['angular', 'chosenJquery'],
        fileUpload: ['angular'],
        ngTable: ['angular'],
        'e-smart-zoom': ['jquery'],
        angularDrag: ['angular', 'jquery'],
        treeControl: ['angular'],
        'poi-msg': ['jquery'],
        hotkey: ['angular'],
        dataService: ['angular', 'sweet-alert'],
        metaService: ['dataService'],
        fccService: ['dataService'],
        editService: ['dataService'],
        manService: ['dataService'],
        bootstrapDatepicker: ['jquery', 'bootstrap'],
        bootstrapDatepickerCN: ['bootstrapDatepicker'],
        timepicki: ['jquery', 'angular'],
        bootspopover: ['jquery'],
        keyPressFunctions: ['jquery', 'dataService', 'metaService', 'editService'],
        'z-tree': ['jquery'],
        fastmapUikit: ['angular'],
        fmEditView: ['fastmapUikit'],
        fmBindCompiledHtml: ['fastmapUikit'],
        select2: ['jquery'],
        langcodeFilter: ['fastmapUikit'],
        EditorCtl: ['ocLazyLoad', 'jquery', 'ngCookies', 'ngLayout', 'uiBootstrap', 'fileUpload', 'angularDrag', 'sweet-alert', 'metaService', 'fccService', 'editService', 'manService', 'layers', 'wheelZoom', 'ngTable', 'ngSanitize', 'keyPressFunctions', 'bootstrapDatepicker', 'bootstrapDatepickerCN', 'timepicki', 'bootspopover', 'e-smart-zoom', 'z-tree', 'poi-msg', 'fastmapUikit', 'fmEditView', 'angularChosen', 'select2', 'langcodeFilter', 'hotkey', 'treeControl']
    }
});
// Start the main app logic.
requirejs(['EditorCtl'], function () {
    angular.bootstrap(document.body, ['app']);
});
