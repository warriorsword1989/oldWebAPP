/**
 * Created by liwanchong on 2016/3/9.
 */
var showDirectApp = angular.module("mapApp", []);
showDirectApp.controller("showDirectOfConnexity",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.showData = objCtrl.data;
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
    $scope.addNormalData = function (item, event) {
        var obj = {"flag":"test" , "log": ""};
        if(  $scope.showData.showAdditionalData.length===0) {
            $scope.showData.showNormalData.push(item);
            $scope.showData.showTransitData.push(obj);
            $scope.showData.inLaneInfoArr.push(item.flag)
        }else{
            var len =    $scope.showData.showNormalData.length;
            $scope.showData.showNormalData.splice(len - 1, 0, item);
            $scope.showData.showTransitData.splice(len - 1, 0, obj);
            $scope.showData.inLaneInfoArr.splice(len - 1, 0, item.flag);
        }


    };
    //增加附加车道(右击)
    $scope.additionalData=function(event,item) {
        if(event.button===2) {
            event.preventDefault();
            var transitObj = {"flag":"test" , "log": ""};
            if($scope.showData.showAdditionalData.length===0) {
                var obj = {},additionStr;
                angular.extend(obj, item);
                additionStr = "[" + item.flag + "]";
                $scope.showData.inLaneInfoArr.push(additionStr);
                obj["flag"] = obj.flag.toString()+obj.flag.toString()+obj.flag.toString();
                $scope.showData.showNormalData.push(obj);
                $scope.showData.showTransitData.push(transitObj);
                $scope.showData.showAdditionalData.push(obj);
            }
        }



    };
})