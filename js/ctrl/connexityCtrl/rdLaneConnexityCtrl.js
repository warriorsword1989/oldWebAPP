/**
 * Created by liuzhaoxia on 2015/12/23.
 */
var otherApp = angular.module('mapApp', ['oc.lazyLoad']);
otherApp.controller("rdLaneConnexityController", function ($scope,$ocLazyLoad) {

    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl=fastmap.uikit.OutPutController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var linksObj = {};//存放需要高亮的进入线和退出线的id
    $scope.showNormalData = [];
    $scope.showTransitData = [];
    $scope.outLanesArr = [];

    //附加车道图标获得
    $scope.getAdditionalLane = function (index, data) {
        var obj = {}, arr;
        if (data.length === 1) {
            $scope.showNormalData.push(data);
            $scope.showTransitData.push("test");
        } else {
            arr = data.split("[");
            //把第一个放进去
            $scope.showNormalData.push(arr[0]);
            $scope.showTransitData.push("test");
            //第二个
            if (index === 0) {
                $scope.showNormalData.unshift([arr[1].substr(0, 1)]);
                $scope.showTransitData.unshift("test");
            } else {
                $scope.showNormalData.push([arr[1].substr(0, 1)]);
                $scope.showTransitData.push("test");
            }

        }
    };
    //公交车道图标获得
    $scope.getTransitData = function (data) {
        var obj = {}, arr;
        if (data.length === 1) {
            $scope.showNormalData.push(data);
            $scope.showTransitData.push("test");
        } else {
            arr = data.split("<");
            //把第一个放进去
            $scope.showNormalData.push(arr[0]);
            //第二个
            $scope.showTransitData.push(arr[1].substr(0, 1).toString()+arr[1].substr(0, 1).toString());
        }
    }
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    //删除以前高亮的进入线和退出线
    if(highLightLayer.highLightLayersArr.length!==0) {
        highLightLayer.removeHighLightLayers();
    }
    $scope.initializeData = function () {
        var reg = new RegExp("/\<|\>|\&/g");
        $scope.lanesData = objCtrl.data;
        $scope.lanesArr = $scope.lanesData["laneInfo"].split(",");

        //删除以前高亮的进入线和退出线
        if(highLightLayer.highLightLayersArr.length!==0) {
            highLightLayer.removeHighLightLayers();
        }
        //高亮进入线和退出线
        linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
        for(var i= 0,len=(objectEditCtrl.data.topos).length;i<len;i++) {
            linksObj["outLink" + i] = objectEditCtrl.data.topos[i].outLinkPid.toString();
        }
        var highLightLinks=new fastmap.uikit.HighLightRender(rdLink,{map:map,highLightFeature:"links",linksObj:linksObj})
        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);



        var lanesLen = $scope.lanesArr.length;
        for(var j= 0,lenJ=$scope.lanesArr.length;j<lenJ;j++) {
            if(j===0||j===lenJ-1) {
                if(reg.test($scope.lanesArr[j])) {
                    $scope.getTransitData($scope.lanesArr[j]);
                }else{
                    $scope.getAdditionalLane(j,$scope.lanesArr[j]);
                }
            }else {
                $scope.getTransitData($scope.lanesArr[j]);
            }

        }
        for (var i = 0, len = $scope.lanesData["topos"].length; i < len; i++) {
            var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
            if (arrOfDecimal[0] === "1") {
                $scope.outLanesArr.push($scope.lanesData["topos"][i]);
            }

        }
    };

    //调用的方法
    objectEditCtrl.rdLaneObject=function(){
        $scope.showNormalData = [];
        $scope.showTransitData = [];
        $scope.outLanesArr = [];
        $scope.initializeData();
    }
    if (objCtrl.data) {
        $scope.initializeData();
    }
    $scope.addLeftAdditionalLane=function(event) {
        var p = /^([0-9])$/;
        if(p.test($scope.lanesData.leftExtend)) {

        }
    };
    $scope.addRdLancdData = [
        {"id": '0', "class": false},
        {"id": '1', "class": false},
        {"id": '2', "class": false},
        {"id": '3', "class": false},
        {"id": '4', "class": false},
        {"id": '5', "class": false},
        {"id": 'a', "class": false},
        {"id": 'b', "class": false},
        {"id": 'c', "class": false},
        {"id": 'd', "class": false},
        {"id": 'e', "class": false},
        {"id": 'f', "class": false},
        {"id": 'g', "class": false},
        {"id": 'h', "class": false},
        {"id": 'i', "class": false},
        {"id": 'j', "class": false},
        {"id": 'k', "class": false},
        {"id": 'l', "class": false},
        {"id": 'm', "class": false},
        {"id": 'n', "class": false},
        {"id": 'o', "class": false},
        {"id": 'r', "class": false},
        {"id": 's', "class": false},
        {"id": 't', "class": false},
        {"id": 'u', "class": false},
        {"id": 'v', "class": false},
        {"id": 'w', "class": false},
        {"id": 'x', "class": false},
        {"id": 'y', "class": false}
    ];
    $scope.ptOriginArray = [
        {"index": 0, "id": 3},
        {"index": 1, "id": 4},
        {"index": 2, "id": 5},
        {"index": 3, "id": 11},
        {"index": 4, "id": "a5"}
    ];
    $scope.gjOriginArray = [
        {"index": 0, "id": 0},
        {"index": 1, "id": 0},
        {"index": 2, "id": 0},
        {"index": 3, "id": 0},
        {"index": 4, "id": "a5"}
    ];
    for (var i in $scope.addRdLancdData) {
        for (var j in $scope.originArray) {
            if ($scope.addRdLancdData[i].id == $scope.originArray[j].id) {
                $scope.addRdLancdData[i].class = true;
            }
        }
    }
    $scope.changeColor = function (item, index) {
        var istrue = true;
        for (var i in $scope.addRdLancdData) {
            if ($scope.addRdLancdData[i].id == item.id && $scope.addRdLancdData[i].class == true) {
                $scope.addRdLancdData[i].class = false;
                istrue = false;
            }
        }
        if (istrue) {
            $scope.showNormalData.push(item.id);
            $scope.showTransitData.push("test");
        }
    }

    $scope.addTips = function () {
        for (var i in $scope.addRdLancdData) {
            if ($scope.addRdLancdData[i].id == $scope.tipsId) {
                $scope.addRdLancdData[i].class = true;
            }
        }
    }
    //REACH_DIR
    $scope.showLanesInfo=function(item,index) {
        $scope.lanesData["index"] = index;
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/connexityCtrl/showInfoOfConnexityCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/showInfoConnexityTepl.html";
        })
    };
});

