/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectCtroller', ['$scope', '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var linksObj = {}, rdLink = layerCtrl.getLayerById("referenceLine");
    var outputCtrl = fastmap.uikit.OutPutController({});
    $scope.isActive = [true, false, false, false, false, false];
    //改变模块的背景
    $scope.changeActive = function (id) {
        for (var num = 0, len = $scope.isActive.length; num < len; num++) {
            if (num === id) {
                $scope.isActive[num] = true;
            } else {
                $scope.isActive[num] = false;
            }
        }
    }
    $scope.initializeLinkData = function () {
        objectCtrl.setOriginalData($.extend(true, {}, objectCtrl.data.data));
        $scope.linkData = objectCtrl.data.data;
        for (var item = 0, len = ($scope.linkData.speedlimits).length; item < len; item++) {
            $scope.linkData.speedlimits[item]["fromSpeedLimit"] = $scope.linkData.speedlimits[item]["fromSpeedLimit"] / 10;
            $scope.linkData.speedlimits[item]["toSpeedLimit"] = $scope.linkData.speedlimits[item]["toSpeedLimit"] / 10;
        }
        $("#basicModule").css("background-color", "#49C2FC");
        $scope.changeActive(0);
        $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
            $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
        });
        //随着地图的变化 高亮的线不变
        var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "link",
            initFlag: true,
            linkPid: $scope.linkData.pid.toString()
        });
        highLightLayer.pushHighLightLayers(highLightLink);
    };
    //初始化controller调用
    if (objectCtrl.data) {
        $scope.initializeLinkData();
    }
    //不是初始化时,初始化需要显示的数据
    objectCtrl.updateObject = function () {
        $scope.initializeLinkData();
    };

    //获取某个模块的信息
    $scope.changeModule = function (url) {
        if (url === "basicModule") {
            $scope.changeActive(0);
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
            $scope.changeActive(2);
            $ocLazyLoad.load('ctrl/linkCtrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            $scope.changeActive(3);
            $ocLazyLoad.load('ctrl/linkCtrl/realtimeTrafficCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
            $scope.changeActive(4);
            $ocLazyLoad.load('ctrl/linkCtrl/zonePeopertyCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
            $scope.changeActive(1);
            $ocLazyLoad.load('ctrl/linkCtrl/limitedCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/limitedTepl.html";
            });
        } else if (url == "otherModule") {
            $scope.changeActive(5);
            $ocLazyLoad.load('ctrl/linkCtrl/otherCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/otherTepl.html";
            });
        }
        $(":button").css("background-color", "#fff");
        $("#" + url).css("background-color", "#49C2FC");
    }

    $scope.changeDirect = function (direc) {
    };

    $scope.addSideWalk = function () {
        if (!$("#sideWalkDiv").hasClass("in")) {
            $("#sideWalkDiv").addClass("in");
        }
        $scope.naviData.sideWalkData = {
            sidewalkLoc: "4",
            dividerType: "2",
            workDir: "2",
            processFlag: "1",
            captureFlag: "1"
        }
    };
    $scope.$parent.$parent.save = function () {
        objectCtrl.setCurrentObject($scope.linkData);
        objectCtrl.save();
        var param = {
            "command": "updatelink",
            "projectId": 11,
            "data": objectCtrl.changedProperty
        };

        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info=[];
            if(data.data){
                $.each(data.data.log,function(i,item){
                    if(item.pid){
                        info.push(item.op+item.type+"(pid:"+item.pid+")");
                    }else{
                        info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                    }
                });
            }else{
                info.push(data.errmsg+data.errid)
            }
            outputCtrl.pushOutput(info);
            if(outputCtrl.updateOutPuts!=="") {
                outputCtrl.updateOutPuts();
            }
        })
    };
    $scope.$parent.$parent.delete = function () {
        var objId = parseInt($scope.linkData.pid);
        var param = {
            "command": "deletelink",
            "projectId": 11,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info=[];
            if(data.data){
                $.each(data.data.log,function(i,item){
                    if(item.pid){
                        info.push(item.op+item.type+"(pid:"+item.pid+")");
                    }else{
                        info.push(item.op+item.type+"(rowId:"+item.rowId+")");
                    }
                });
            }else{
                info.push(data.errmsg+data.errid)
            }
            //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"
            if (data.errmsg != "此link上存在交限关系信息，删除该Link会对应删除此组关系") {
                rdLink.redraw();
                outputCtrl.pushOutput(info);
                if(outputCtrl.updateOutPuts!=="") {
                    outputCtrl.updateOutPuts();
                }
                $scope.linkData = null;
                var editorLayer = layerCtrl.getLayerById("edit")
                editorLayer.clear();
                $scope.$parent.$parent.objectEditURL = "";
            } else {
                outputCtrl.pushOutput(info);
                if(outputCtrl.updateOutPuts!=="") {
                    outputCtrl.updateOutPuts();
                }
            }

        })
    }
}]);