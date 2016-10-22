/**
 * Created by liwanchong on 2015/10/29.
 */
var basicApp = angular.module("app");
basicApp.controller("nameController", function($scope, $ocLazyLoad) {
    $scope.linkData.names.sort(function(a, b) {
        if (a.nameClass < b.nameClass) {
            return 1;
        } else if (a.nameClass == b.nameClass) {
            if (a.seqNum < b.seqNum) {
                return 1
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    });
    $scope.showNames = function(nameItem, index) {
        //$scope.linkData["oridiRowId"] = nameItem.rowId;
        var showBlackObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            "callback": function() {
                var showNamesObj = {
                    "loadType": "subAttrTplContainer",
                    "propertyCtrl": 'scripts/components/road/ctrls/attr_link_ctrl/namesOfDetailCtrl',
                    "propertyHtml": '../../../scripts/components/road/tpls/attr_link_tpl/namesOfDetailTpl.html',
                    "data": index + "" //必须将数字转成字符串
                };
                $scope.$emit("transitCtrlAndTpl", showNamesObj);
            }
        };
        $scope.$emit("transitCtrlAndTpl", showBlackObj);
    };
    $scope.addRdName = function() {
        var newName = {};
        var seqNum = 0;
        for (var i = 0; i < $scope.linkData.names.length; i++) {
            if ($scope.linkData.names[i].nameClass == 1 && $scope.linkData.names[i].seqNum > seqNum) {
                seqNum = $scope.linkData.names[i].seqNum;
            }
        }
        seqNum = seqNum + 1;
        if ($scope.linkData.kind == 1 || $scope.linkData.kind == 2 || $scope.linkData.kind == 3) {
            newName = fastmap.dataApi.rdLinkName({
                "linkPid": $scope.linkData.pid,
                'seqNum': seqNum,
                "code": 1
            });
        } else {
            newName = fastmap.dataApi.rdLinkName({
                "linkPid": $scope.linkData.pid,
                'seqNum': seqNum
            });
        }
        $scope.linkData.names.unshift(newName);
    };
    $scope.minusName = function(id) {
    	var t = $scope.linkData.names[id];
	    for(var i=0;i<$scope.linkData.names.length;i++){
	    	if($scope.linkData.names[i].seqNum > t.seqNum && $scope.linkData.names[i].nameClass == t.nameClass){
	    		$scope.linkData.names[i].seqNum = $scope.linkData.names[i].seqNum -1;
	    	}
	    }
	    $scope.linkData.names.splice(id, 1);
	    $scope.$emit("SWITCHCONTAINERSTATE", {
	        "subAttrContainerTpl": false
	    });
    }
    $scope.changeColor = function(ind, ord) {
        $("#nameSpan" + ind).css("color", "#FFF");
    }
    $scope.backColor = function(ind, ord) {
        $("#nameSpan" + ind).css("color", "darkgray");
    }
}).filter('ArrayIndexFilter', function () {
    return function (array, index) {
        if (!index)
            index = 'index';
        for (var i = 0; i < array.length; ++i) {
            array[i][index] = i;
        }
        return array;
    };
});