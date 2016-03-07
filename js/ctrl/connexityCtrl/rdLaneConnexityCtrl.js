/**
 * Created by liuzhaoxia on 2015/12/23.
 */
var otherApp = angular.module('mapApp', ['oc.lazyLoad']);
otherApp.controller("rdLaneConnexityController", function ($scope, $ocLazyLoad, $document) {

    var objCtrl = fastmap.uikit.ObjectEditController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdConnexity = layerCtrl.getLayerById("rdlaneconnexity");
    var linksObj = {};//存放需要高亮的进入线和退出线的id
    objCtrl.setOriginalData($.extend(true, {}, objCtrl.data));
    $scope.showNormalData = [];
    $scope.showTransitData = [];
    $scope.outLanesArr = [];
    $scope.selectNum = 10;
    $scope.addFlag = false;
    $scope.changeFlag = false;
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
            $scope.showTransitData.push(arr[1].substr(0, 1).toString() + arr[1].substr(0, 1).toString());
        }
    }
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    //删除以前高亮的进入线和退出线
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    $scope.initializeData = function () {

        var reg = new RegExp("/\<|\>|\&/g");
        $scope.lanesData = objCtrl.data;
        $scope.lanesArr = $scope.lanesData["laneInfo"].split(",");

        //删除以前高亮的进入线和退出线
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        //高亮进入线和退出线
        linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
        for (var i = 0, len = (objectEditCtrl.data.topos).length; i < len; i++) {
            linksObj["outLink" + i] = objectEditCtrl.data.topos[i].outLinkPid.toString();
        }
        var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "links",
            linksObj: linksObj
        })
        highLightLinks.drawOfLinksForInit();
        highLightLayer.pushHighLightLayers(highLightLinks);

        for (var j = 0, lenJ = $scope.lanesArr.length; j < lenJ; j++) {
            if (j === 0 || j === lenJ - 1) {
                if (reg.test($scope.lanesArr[j])) {
                    $scope.getTransitData($scope.lanesArr[j]);
                } else {
                    $scope.getAdditionalLane(j, $scope.lanesArr[j]);
                }
            } else {
                $scope.getTransitData($scope.lanesArr[j]);
            }

        }
    };

    //调用的方法
    objectEditCtrl.rdLaneObject = function () {
        $scope.showNormalData = [];
        $scope.showTransitData = [];
        $scope.outLanesArr = [];
        $scope.initializeData();
    }
    if (objCtrl.data) {
        $scope.initializeData();
    }
    $scope.addLeftAdditionalLane = function (event) {
        var p = /^([0-9])$/;
        if (p.test($scope.lanesData.leftExtend)) {

        }
    };

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

    //修改方向
    $scope.changeDirect = function (item, event, index) {
        if (event.button === 2) {
            $scope.changeFlag = true;
            $scope.addFlag = false;
            $scope.lanesData["selectNum"] = index;
            $scope.selectNum = index;
            $scope.changeItem = item;
            $scope.$parent.$parent.suspendObjURL = "";
            if (!$scope.$parent.$parent.suspendFlag) {
                $scope.$parent.$parent.suspendFlag = true;
            }
            $ocLazyLoad.load('ctrl/connexityCtrl/changeDirectOfConnexityCtrl').then(function () {
                $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/changeDirectOfConnexityTepl.html";
            })
            map.currentTool = new fastmap.uikit.SelectPath(
                {
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: false,
                    shapeEditor: shapeCtrl
                });
            map.currentTool.enable();
            if ($scope.changeFlag) {
                rdLink.on("getOutLinksPid", function (data) {
                    //删除以前高亮的进入线和退出线
                    if (highLightLayer.highLightLayersArr.length !== 0) {
                        highLightLayer.removeHighLightLayers();
                    }
                    linksObj = {};
                    objectEditCtrl.data.topos[index].outLinkPid = data.id;
                    //高亮进入线和退出线
                    linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
                    for (var i = 0, len = (objectEditCtrl.data.topos).length; i < len; i++) {
                        {
                            linksObj["outLink" + i] = objectEditCtrl.data.topos[i].outLinkPid.toString()

                        }
                        var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                            map: map,
                            highLightFeature: "links",
                            linksObj: linksObj
                        })
                        highLightLinks.drawOfLinksForInit();
                        highLightLayer.pushHighLightLayers(highLightLinks);
                    }

                });
            }
        }
    };
    //REACH_DIR
    $scope.showLanesInfo = function (item, index, event) {
        $scope.selectNum = index;
        $scope.changeItem = item;
        if (!$scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $scope.lanesData["index"] = index;
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/connexityCtrl/showInfoOfConnexityCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/showInfoConnexityTepl.html";
        })

    };
    //增加车道
    $scope.addLane = function () {
        if (!$scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $scope.addFlag = true;
        $scope.changeFlag = false;
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/connexityCtrl/changeDirectOfConnexityCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/changeDirectOfConnexityTepl.html";
        })
        layerCtrl.pushLayerFront('edit');
        map.currentTool = new fastmap.uikit.SelectPath(
            {
                map: map,
                currentEditLayer: rdLink,
                linksFlag: false,
                shapeEditor: shapeCtrl
            });
        //var currentTool= new fastmap.uikit.SelectPath({map: map, currentEditLayer: rdLink,linksFlag:false});
        map.currentTool.enable();
        if ($scope.addFlag) {
            rdLink.on("getOutLinksPid", function (data) {
                //删除以前高亮的进入线和退出线
                if (highLightLayer.highLightLayersArr.length !== 0) {
                    highLightLayer.removeHighLightLayers();
                }
                linksObj = {};
                objectEditCtrl.data.topos[(objectEditCtrl.data.topos).length - 1].outLinkPid = data.id;
                //高亮进入线和退出线
                linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
                for (var i = 0, len = (objectEditCtrl.data.topos).length; i < len; i++) {
                    {
                        linksObj["outLink" + i] = objectEditCtrl.data.topos[i].outLinkPid.toString()

                    }
                    var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                        map: map,
                        highLightFeature: "links",
                        linksObj: linksObj
                    })
                    highLightLinks.drawOfLinksForInit();
                    highLightLayer.pushHighLightLayers(highLightLinks);
                }

            });
        }
    };
    //删除车道
    $scope.minusLane=function(index) {
        $scope.showNormalData.splice(index, 1);
        $scope.showTransitData.splice(index, 1);
        if(index===0){
            $scope.lanesArr[0] = $scope.showNormalData[0];
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");//修改laneInfo字段
            $scope.lanesData["leftExtend"] = 0;
        }else if(index===($scope.lanesArr.length-1)) {
            $scope.lanesArr[$scope.lanesArr.length-1] = $scope.showNormalData[$scope.lanesArr.length-1];
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");//修改laneInfo字段
            $scope.lanesData["leftExtend"] = 0;
        }else{
            $scope.lanesArr.splice(index, 1);//
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");//修改laneInfo字段

            var lenN = $scope.lanesData["topos"].length,arr=[];

            for(var n= 0;n<lenN;n++) {
                var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][n]["inLaneInfo"]);
                var lenOfInfo =(16- arrOfDecimal.length);
                if (lenOfInfo!== index) {
                    arr.push($scope.lanesData["topos"][n]);
                }
            }
            $scope.lanesData["topos"].length = 0;
            $scope.lanesData["topos"] = arr;
        }

    };
    $scope.minusTransitData=function(item,index) {
        var num = index;
        $scope.showTransitData[num] = "text";
        if($scope.showNormalData[0].indexOf("[")!==-1) {
            num -= 1;
        }
        $scope.lanesArr[num] = $scope.showNormalData[num];
        $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");
        for(var k= 0,lenK=$scope.lanesData["topos"].length;k<lenK;k++) {
            var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][k]["inLaneInfo"]);
            var lenOfInfo =(16- arrOfDecimal.length);
            if(lenOfInfo===num) {
                $scope.lanesData["topos"][k]["busLaneInfo"] = 0;

            }
        }
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/connexityCtrl/showInfoOfConnexityCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/showInfoConnexityTepl.html";
        })

    };
    $document.bind("keydown", function (event) {
        if (event.keyCode == 16) {//shift键 公交车道
            var transitId = "";
            $scope.showTransitData[$scope.selectNum] = $scope.showNormalData[$scope.selectNum].toString() + $scope.showNormalData[$scope.selectNum].toString();
            if($scope.changeItem.id) {
                transitId = $scope.changeItem.id;
            }else{
                transitId = $scope.changeItem;
            }
            var transitStr = "<" + transitId + ">"
            $scope.lanesArr[$scope.selectNum] += transitStr;
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");
            for(var k= 0,lenK=$scope.lanesData["topos"].length;k<lenK;k++) {
                var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][k]["inLaneInfo"]);
                var lenOfInfo =(16- arrOfDecimal.length);
                if(lenOfInfo=== $scope.selectNum) {
                    $scope.lanesData["topos"][k]["busLaneInfo"] = $scope.lanesData["topos"][k]["inLaneInfo"];
                }
            }
            $scope.$parent.$parent.suspendObjURL = "";
            $ocLazyLoad.load('ctrl/connexityCtrl/showInfoOfConnexityCtrl').then(function () {
                $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/showInfoConnexityTepl.html";
            })

            $scope.$apply();
        } else if (event.keyCode === 17) {//ctrl键 附加车道
            if ($scope.selectNum === 0 || $scope.selectNum === ($scope.lanesArr.length - 1)) {
                var additionId = "";
                if($scope.changeItem.id) {
                    additionId = $scope.changeItem.id;
                }else{
                    additionId = $scope.changeItem;
                }
                var additionStr = "[" + additionId + "]";
               if($scope.selectNum === 0) {
                   $scope.showNormalData.unshift([additionId]);
                   $scope.lanesArr[0] += additionStr;
                   $scope.lanesData["leftExtend"] = 1;
               }else{
                   $scope.showNormalData.push([additionId]);
                   $scope.lanesArr[$scope.lanesArr.length - 1] += additionStr;
                   $scope.lanesData["rightExtend"] = 1;
                }
                $scope.showTransitData.push("test");
                $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");

                $scope.$apply();

            }
        }


    });
    $scope.$parent.$parent.save = function () {
        objCtrl.setCurrentObject( $scope.lanesData);
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDLANECONNEXITY",
            "projectId": 11,
            "data": objCtrl.changedProperty
        };

        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = [];
            if (data.data) {
                var sinfo={
                    "op":"修改车信成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
            rdConnexity.redraw();
        })

    };
    $scope.$parent.$parent.delete = function () {
        var objId = parseInt( $scope.lanesData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDLANECONNEXITY",
            "projectId": 11,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdConnexity.redraw();
                $scope.rdCrossData = null;
                $scope.$parent.$parent.objectEditURL = "";
                var sinfo={
                    "op":"删除车信成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }

            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })
    }
});

