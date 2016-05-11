/**
 * Created by liwanchong on 2016/3/9.
 */
var showDirectApp = angular.module("mapApp");
showDirectApp.controller("showDirectOfConnexity",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.showData = objCtrl.originalData;
    $scope.laneConnexityData = [
        {flag: "a", log: "直"},
        {flag: "b", log: "左"},
        {flag: "c", log: "右"},
        {flag: "d", log: "调"},
        {flag: "e", log: "直调"},
        {flag: "f", log: "直右"},
        {flag: "g", log: "直左"},
        {flag: "h", log: "左直右"},
        {flag: "i", log: "调直右"},
        {flag: "j", log: "调左值"},
        {flag: "k", log: "左右"},
        {flag: "i", log: "调右"},
        {flag: "m", log: "调左右"},
        {flag: "n", log: "调右"},
        {flag: "o", log: "空"}
    ];
    //增加普通车道方向(单击)
    $scope.addNormalData = function (item) {
        var transitObj = {"flag":"test" , "type": 1},
          normalObj = {
                "flag": item.flag,
                "type": 0
            };;
        if(  $scope.showData.showAdditionalData.length===0) {

            $scope.showData.showNormalData.push(normalObj);
            $scope.showData.showTransitData.push(transitObj);
            $scope.showData.inLaneInfoArr.push(item.flag)
        }else{
            var len = $scope.showData.showNormalData.length;
            $scope.showData.showNormalData.splice(len - 1, 0, normalObj);
            $scope.showData.showTransitData.splice(len - 1, 0, transitObj);
            $scope.showData.inLaneInfoArr.splice(len - 1, 0, item.flag);
        }


    };
    //增加附加车道(右击)
    $scope.additionalData=function(event,item) {
        if(event.button===2) {
            event.preventDefault();
            var transitObj = {"flag": "test", "type": 1},
                normalObj = {
                    "flag": item.flag,
                    type: 0
                },
                additionObj = {
                    "flag": item.flag,
                    type: 2
                };

            if($scope.showData.showAdditionalData.length===0) {
                additionStr = "[" + item.flag + "]";
                $scope.showData.inLaneInfoArr.push(additionStr);
                $scope.showData.showNormalData.push(additionObj);
                $scope.showData.showTransitData.push(transitObj);
                $scope.showData.showAdditionalData.push(additionObj);
            }
        }



    };
})