/**
 * Created by zhaohang on 2016/11/1.
 */
angular.module('webeditor').controller('taskGeneralPageCtrl', ['$scope',"ngDialog", function($scope,ngDialog) {
    $scope.openEditor = function() {
      ngDialog.close();
      window.location.href = '#/editor'
    }
    $scope.testTaskData = [{
      taskType: 'POI采集',
      taskName: '测试任务1',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: '道路采集',
      taskName: '测试任务2',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: '一体化采集',
      taskName: '测试任务3',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: 'POI日编',
      taskName: '测试任务4',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: '一体化Grid粗编',
      taskName: '测试任务5',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: '代理店',
      taskName: '测试任务6',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: 'POI采集',
      taskName: '测试任务7',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: '一体化Grid粗编',
      taskName: '测试任务8',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: 'POI采集',
      taskName: '测试任务9',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    },{
      taskType: '一体化采集',
      taskName: '测试任务10',
      createDate: '2016-09-29',
      poiNum: 40,
      tipsNum: 60
    }]

}]);