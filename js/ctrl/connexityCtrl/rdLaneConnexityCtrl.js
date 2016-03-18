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
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdConnexity = layerCtrl.getLayerById("rdlaneconnexity");

    var linksObj = {};//存放需要高亮的进入线和退出线的id
    objCtrl.setOriginalData(objCtrl.data.getIntegrate());

    //附加车道图标获得
    $scope.getAdditionalLane = function (index, data) {
        var obj = {}, arr;
        if (data.length === 1) {
            $scope.showNormalData.push(data);
            $scope.showTransitData.push("test");
        } else {
            arr = data.split("");
            //
            if (index === 0) {
                $scope.showNormalData.unshift(arr[1].toString() + arr[1].toString() + arr[1].toString());
                if(arr[4]) {
                    $scope.showTransitData.unshift(arr[4].toString() + arr[4].toString());
                }else{
                    $scope.showTransitData.unshift("test");
                }
            } else {
                $scope.showNormalData.push(arr[1].substr(0, 1).toString() + arr[1].substr(0, 1).toString() + arr[1].substr(0, 1).toString());
                if(arr[4]) {
                    $scope.showTransitData.push(arr[4].toString() + arr[4].toString());
                }else{
                    $scope.showTransitData.push("test");
                }
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
            if(arr[0]) {
                //把第一个放进去
                $scope.showNormalData.push(arr[0]);
                //第二个
                $scope.showTransitData.push(arr[1].substr(0, 1).toString() + arr[1].substr(0, 1).toString());
            }

        }
    }
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    $scope.intToDecial = function (data) {
        var str = "1";
        for (var i = 0; i < 15 - data; i++) {
            str += "0";
        }
        return parseInt(str, 2).toString(10);
    };
    //删除以前高亮的进入线和退出线
    /*if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }*/
    $scope.initializeData = function () {
        $scope.showNormalData = [];
        $scope.showTransitData = [];
        $scope.outLanesArr = [];
        $scope.selectNum = 10;
        $scope.addFlag = false;
        $scope.changeFlag = false;
        $scope.showInfoFlag = false;
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
    objectEditCtrl.rdLaneObject = function (flag) {
        $scope.showNormalData = [];
        $scope.showTransitData = [];
        $scope.outLanesArr = [];
        $scope.initializeData();
        if(flag) {
            objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        }
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
            $scope.removeTipsActive();
            $(event.target).addClass("active");
            $scope.changeFlag = true;
            $scope.addFlag = false;
            $scope.showInfoFlag = false;
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
                eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
                    //删除以前高亮的进入线和退出线
                    if (highLightLayer.highLightLayersArr.length !== 0) {
                        highLightLayer.removeHighLightLayers();
                    }
                    linksObj = {};
                    for(var i= 0,len=$scope.lanesData["topos"].length;i<len;i++) {
                        var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
                        var lenOfInfo = (16 - arrOfDecimal.length);
                        if (lenOfInfo === index) {
                            objectEditCtrl.data.topos[i].outLinkPid = data.id;
                            linksObj["outLink"] = data.id;
                        }
                    }

                    //高亮进入线和退出线
                    linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
                    var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                        map: map,
                        highLightFeature: "links",
                        linksObj: linksObj
                    })
                    highLightLinks.drawOfLinksForInit();
                    highLightLayer.pushHighLightLayers(highLightLinks);

                });
            }
        }
    };
    $scope.removeTipsActive = function(){
        $.each($('.lanePic'),function(i,v){
            $(v).removeClass('active');
        });
    }
    //REACH_DIR
    $scope.showLanesInfo = function (item, index, event) {
        $scope.removeTipsActive();
        $(event.target).addClass("active");
        $scope.selectNum = index;
        $scope.lanesData["selectNum"] = index;
        $scope.addFlag = false;
        $scope.changeFlag = false;
        $scope.showInfoFlag = true;
        $scope.changeItem = item;
        if (!$scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $scope.lanesData["index"] = index;
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/connexityCtrl/showInfoOfConnexityCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/showInfoConnexityTepl.html";
        })
        map.currentTool = new fastmap.uikit.SelectPath(
            {
                map: map,
                currentEditLayer: rdLink,
                linksFlag: false,
                shapeEditor: shapeCtrl
            });
        map.currentTool.enable();
        if ($scope.showInfoFlag) {
            eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
                //删除以前高亮的进入线和退出线
                if (highLightLayer.highLightLayersArr.length !== 0) {
                    highLightLayer.removeHighLightLayers();
                }
                linksObj = {};
                for(var i= 0,len=$scope.lanesData["topos"].length;i<len;i++) {
                    var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
                    var lenOfInfo = (16 - arrOfDecimal.length);
                    if (lenOfInfo === index) {
                        objectEditCtrl.data.topos[i].outLinkPid = data.id;
                        linksObj["outLink"] = data.id;
                    }
                }

                //高亮进入线和退出线
                linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
                var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                    map: map,
                    highLightFeature: "links",
                    linksObj: linksObj
                })
                highLightLinks.drawOfLinksForInit();
                highLightLayer.pushHighLightLayers(highLightLinks);

            });
        }

    };
    //增加车道
    $scope.addLane = function () {
        var index;
       if($scope.lanesData["selectNum"]!==undefined) {
           index = $scope.lanesData["selectNum"]+1;
       }else{
           index = $scope.lanesArr.length-1;
       }
        if (!$scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $scope.addFlag = true;
        $scope.changeFlag = false;
        $scope.showInfoFlag = false;
        $scope.$parent.$parent.suspendObjURL = "";
        $ocLazyLoad.load('ctrl/connexityCtrl/addDirectOfConnexityCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/addDirectOfConnexityTepl.html";
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
            eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
                //删除以前高亮的进入线和退出线
                if (highLightLayer.highLightLayersArr.length !== 0) {
                    highLightLayer.removeHighLightLayers();
                }
                linksObj = {};
                for(var i= 0,len=$scope.lanesData["topos"].length;i<len;i++) {
                    var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
                    var lenOfInfo = (16 - arrOfDecimal.length);
                    if (lenOfInfo === index) {
                        objectEditCtrl.data.topos[i].outLinkPid = data.id;
                        linksObj["outLink"] = data.id;
                    }
                }
                //高亮进入线和退出线
                linksObj["inLink"] = objectEditCtrl.data["inLinkPid"].toString();
                    var highLightLinks = new fastmap.uikit.HighLightRender(rdLink, {
                        map: map,
                        highLightFeature: "links",
                        linksObj: linksObj
                    })
                    highLightLinks.drawOfLinksForInit();
                    highLightLayer.pushHighLightLayers(highLightLinks);


            });
        }
    };
    //删除车道
    $scope.minusLane = function (index) {
        $scope.showNormalData.splice(index, 1);
        $scope.showTransitData.splice(index, 1);
        $scope.lanesArr.splice(index, 1);//
        $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");//修改laneInfo字段
        $scope.lanesData["laneNum"] -= 1;
        if (index === 0) {
            $scope.lanesData["leftExtend"] = 0;
        } else if (index === ($scope.lanesArr.length - 1)) {
            $scope.lanesData["right"] = 0;
        }
        var lenN = $scope.lanesData["topos"].length, arr = [];
        for (var n = 0; n < lenN; n++) {
            var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][n]["inLaneInfo"]);
            var lenOfInfo = (16 - arrOfDecimal.length);
            if (lenOfInfo !== index) {
                if (lenOfInfo>index) {
                    $scope.lanesData["topos"][n]["inLaneInfo"] = parseInt($scope.intToDecial(lenOfInfo- 1));
                }
                arr.push($scope.lanesData["topos"][n]);
            }
        }
        $scope.lanesData["topos"].length = 0;
        $scope.lanesData["topos"] = arr;


    };
    //删除公交车道
    $scope.minusTransitData = function (item, index) {
            var num = index;
            $scope.lanesData["selectNum"] = index;
            $scope.showTransitData[num] = "test";
            $scope.lanesArr[num] = $scope.showNormalData[num];
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");
            for (var k = 0, lenK = $scope.lanesData["topos"].length; k < lenK; k++) {
                var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][k]["inLaneInfo"]);
                var lenOfInfo = (16 - arrOfDecimal.length);
                if (lenOfInfo === num) {
                    $scope.lanesData["topos"][k]["busLaneInfo"] = 0;

                }
            }


    };
    //修改公交车道
    $scope.changeTransit=function(item,index) {
        if(item!=="test") {
            $scope.lanesData["selectNum"] = index;
            $scope.lanesData["transitFlag"] = true;
            $scope.$parent.$parent.suspendObjURL = "";

            if (!$scope.$parent.$parent.suspendFlag) {
                $scope.$parent.$parent.suspendFlag = true;
            }
            $ocLazyLoad.load('ctrl/connexityCtrl/changeDirectOfConnexityCtrl').then(function () {
                $scope.$parent.$parent.suspendObjURL = "js/tepl/connexityTepl/changeDirectOfConnexityTepl.html";
            })
        }

    };

    $document.bind("keydown", function (event) {
        if (event.keyCode == 16) {//shift键 公交车道
            var transitArr = "";
            if ($scope.changeItem.id) {
                transitArr = ($scope.changeItem.id).split("");
            } else {
                transitArr = ($scope.changeItem).split("");
            }
            var transitStr = "<" + transitArr[0] + ">"
            $scope.showTransitData[$scope.selectNum] =transitArr[0].toString() +transitArr[0].toString();

            if($scope.lanesArr[$scope.selectNum].indexOf("[")!==-1) {
                var additionArr = $scope.lanesArr[$scope.selectNum].split("");
                additionArr[additionArr.length - 1] = (transitStr + "]");
                $scope.lanesArr[$scope.selectNum] = additionArr.join("");
            }else{
                $scope.lanesArr[$scope.selectNum] += transitStr;
            }
            $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");
            for (var k = 0, lenK = $scope.lanesData["topos"].length; k < lenK; k++) {
                var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][k]["inLaneInfo"]);
                var lenOfInfo = (16 - arrOfDecimal.length);
                if (lenOfInfo === $scope.selectNum) {
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
                if ($scope.changeItem.id) {
                    additionId = $scope.changeItem.id;
                } else {
                    additionId = $scope.changeItem;
                }
                if(additionId.length>1) {
                    return;
                }
                var additionStr = "[" + additionId + "]",
                    showAdditionStr = (additionId.toString() + additionId.toString() + additionId.toString());
                if ($scope.selectNum === 0) {
                    $scope.showNormalData[0] = showAdditionStr;
                    $scope.lanesArr[0] = additionStr;
                    $scope.lanesData["leftExtend"] = 1;
                } else {
                    $scope.showNormalData[$scope.selectNum] = showAdditionStr;
                    $scope.lanesArr[$scope.selectNum] = additionStr;
                    $scope.lanesData["rightExtend"] = 1;
                }
                $scope.lanesData["laneInfo"] = $scope.lanesArr.join(",");

                $scope.$apply();

            }
        }


    });
    $scope.$parent.$parent.save = function () {
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDLANECONNEXITY",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        };
        if ($scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = false;
        }
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = [];
            if (data.data) {
                var sinfo = {
                    "op": "修改车信成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
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
        var objId = parseInt($scope.lanesData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDLANECONNEXITY",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            //删除高亮的进入线和退出线
            if (highLightLayer.highLightLayersArr.length !== 0) {
                highLightLayer.removeHighLightLayers();
            }
            var info = null;
            if (data.errcode == 0) {
                rdConnexity.redraw();
                $scope.rdCrossData = null;
                $scope.$parent.$parent.objectEditURL = "";
                var sinfo = {
                    "op": "删除车信成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
                    "pid": data.errid
                }];
            }

            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })
    }

    $scope.$parent.$parent.cancel=function(){
        $scope.$parent.$parent.panelFlag = false;
        $scope.$parent.$parent.objectFlag = false;
        $scope.$parent.$parent.objectEditURL="";
    }
});

