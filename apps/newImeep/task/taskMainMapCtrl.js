/**
 * Created by zhaohang on 2016/11/1.
 */
angular.module('webeditor').controller('taskMainMapCtrl', ['$scope', 'ngDialog', '$rootScope',
    function ($scope, ngDialog, $rootScope) {
    // 根据屏幕计算高度
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;
        var percent = height / 1019;

        $scope.mapBackGround = {
            'padding-top': (height - (1000 * percent)) / 2 + 'px',
            width: width + 'px',
            height: height + 'px',
            position: 'absolute'
        };

    // var layerCtrl = new fastmap.uikit.LayerController({
    //   config: App.layersConfig
    // });
    //
    // $rootScope.map.setView([40.012834, 116.476293], 14);
    // for (var layer in layerCtrl.getVisibleLayers()) {
    //   $rootScope.map.addLayer(layerCtrl.getVisibleLayers()[layer]);
    // }

        $scope.mapTemp = './editor/templates/mapTemp.html';
        $rootScope.mapTemp = $scope.mapTemp;
        $scope.showModalTest = function () {
            ngDialog.open({
                template: 'task/taskGeneralPage.html',
                controller: 'taskGeneralPageCtrl',
                className: 'ngdialog-theme-default',
                width: '100%',
                height: '100%'
            });
        };
        $scope.showModalTest();
    }
]);

