/**
 * Created by zhaohang on 2016/11/14.
 */
angular.module('app').controller("ThematicMap", ['$scope',
  function ($scope) {
    $scope.ThematicMapArray = [{
      type: 'rdLinkLimitTruck',
      name: '卡车限制信息'
    }, {
      type: 'rdLinkLimit',
      name: 'link限制信息数量（普通限制信息）'
    }, {
      type: 'rdlinkSpeedlimitSpeedClass',
      name: '普通线限速限速等级'
    }, {
      type: 'rdlinkSpeedlimitSpeedClassWork',
      name: '普通线限速限速等级赋值标识'
    }, {
      type: 'rdlinkSpeedlimitSpeedLimitSrc',
      name: '普通线限速限速来源'
    }, {
      type: 'rdLinkLaneClass',
      name: 'link车道等级'
    }, {
      type: 'rdLinkFunctionClass',
      name: 'link功能等级'
    }, {
      type: 'rdLinkLaneNum',
      name: '车道数（总数）'
    }];
    $scope.selectThematicMap = function (type, $event) {
      var layerCtrl = fastmap.uikit.LayerController();
      var layer = layerCtrl.getLayerById('thematicLink');
      if (type === 'close') {
        layerCtrl.setLayerVisibleOrNot('rdLink', true);
        layerCtrl.setLayerVisibleOrNot('thematicLink', false);
      } else {
        layerCtrl.setLayerVisibleOrNot('rdLink', false);
        layerCtrl.setLayerVisibleOrNot('thematicLink', true);
        layer.url.parameter["type"] = (type);
        layer.redraw();
      }
      if($event.preventDefault){
        $event.preventDefault();
      }
    }
  }
]);