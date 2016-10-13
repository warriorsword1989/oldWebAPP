/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("AutofillJobPanelCtrl", ['$scope', '$interval', 'dsFcc', 'dsEdit','dsOutput',
    function($scope, $interval, dsFcc, dsEdit, dsOutput) {
		    var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        $scope.tipList = [];
        $scope.selectedTips = {};
        // var stages;
        // if (App.Temp.mdFlag == "d") { //日编
        //     stages = [1, 2];
        // } else { //月编
        //     stages = [1, 2, 3];
        // }
        // dsFcc.getTipsStatics(stages).then(function(data) {
        //     var list = [],
        //         tmp;
        //     for (var i = 0, n = data.data.rows.length; i < n; i++) {
        //         for (var item in data.data.rows[i]) {
        //             tmp = {};
        //             tmp.id = item;
        //             tmp.name = fastmap.uikit.FeatureConfig.tip[item].name;
        //             $scope.tipList.push(tmp);
        //         }
        //     }
        // });
        var tipsObj = fastmap.uikit.FeatureConfig.tip;
        var arr =[];
        for(var item in tipsObj){
            arr.push({id:item,name:tipsObj[item].name,checked:tipsObj[item].checked});
            if(tipsObj[item].checked){
                $scope.selectedTips[item] = tipsObj[item].name;
            }
        }
        function compare(propertyName) {
            return function(object1, object2) {
                var value1 = object1[propertyName].length;
                var value2 = object2[propertyName].length;
                if (value2 < value1) {
                    return 1;
                } else if (value2 > value1) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
        arr.sort(compare("name"));
        $scope.tipsObj = arr;
        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function() {
            var tips = [];
            $scope.progress = 0;
            for (var key in $scope.selectedTips) {
                if ($scope.selectedTips[key]) {
                    tips.push(key);
                }
            }
            if (tips.length == 0) {
                swal("请选择要录入的Tips", "", "info");
                return;
            } else {
                $scope.running = true;
                $scope.$emit("job-autofill", {
                    status: 'begin'
                });
                dsFcc.runAutomaticInput(tips).then(function(data){
                  $scope.$emit('closeAdvancedTools');
            			logMsgCtrl.pushMsg($scope,'JobId: '+ data.data.jobId +' ，'+ data.errmsg);
                  var param = {
                      dbId: App.Temp.dbId,
                      gridIds: App.Temp.gridList
                  };
                  var timer = $interval(function() {
                      dsEdit.getJobById(data.data.jobId).then(function(d) {
                          if (d.status == 3 || d.status == 4) { //1-创建，2-执行中 3-成功 4-失败
                              $interval.cancel(timer);
                              $scope.progress = 100;
                              $scope.$emit("job-autofill", {
                                  status: 'end'
                              });
                              $scope.running = false;
                              if (d.status == 3) {
                                  dsOutput.push({
                                      "op": "自动录入JOB执行成功",
                                      "type": "succ",
                                      "pid": "0",
                                      "childPid": ""
                                  });
                                  logMsgCtrl.pushMsg($scope,'自动录入Job完成');
                              } else {
                                  dsOutput.push({
                                      "op": "自动录入JOB执行失败",
                                      "type": "fail",
                                      "pid": "0",
                                      "childPid": ""
                                  });
                                  logMsgCtrl.pushMsg($scope,'自动录入Job失败');
                              }
                          }
                      });
                  }, 500);
                });
                // var loop = $interval(function() {
                //     $scope.progress += 20;
                //     if ($scope.progress == 100) {
                //         clearInterval(loop);
                //         $scope.running = false;
                //         $scope.$emit("job-autofill", {
                //             status: 'end'
                //         });
                //         // swal("自动录入服务模拟运行完成！", "", "success");
                //     }
                // }, 1000)
                return;
            }
        };
    }
]);
