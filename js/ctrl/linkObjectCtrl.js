/**
 * Created by liwanchong on 2015/10/29.
 */
var myApp = angular.module("mapApp", ['oc.lazyLoad']);
myApp.controller('linkObjectCtroller', ['$scope', '$ocLazyLoad','$timeout',function ($scope, $ocLazyLoad,$timeout) {
    var objectCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var linksObj = {}, rdLink = layerCtrl.getLayerById("referenceLine");
    var editLayer = layerCtrl.getLayerById('edit');
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = new fastmap.uikit.SelectController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    $scope.speedAndDirect=shapeCtrl.shapeEditorResult.getFinalGeometry();
    $scope.brigeLinkArrays=$scope.$parent.$parent.brigeLinkArray;
    $scope.brigeIndex=0;

    $scope.isActive = [true, false, false, false, false, false];
    $scope.notAcitive=[false,true,true,true,true,true];
    //改变模块的背景
    $scope.changeActive = function (id) {
        for (var num = 0, len = $scope.isActive.length; num < len; num++) {
            if (num === id) {
                $scope.isActive[num] = true;
                $scope.notAcitive[num]=false;
            } else {
                $scope.isActive[num] = false;
                $scope.notAcitive[num]=true;
            }
        }
    }
    $scope.initializeLinkData = function () {
        $scope.dataTipsData = selectCtrl.rowKey;
        if(objectCtrl.data.data){
            objectCtrl.setOriginalData($.extend(true, {}, objectCtrl.data.data));
            $scope.linkData = objectCtrl.data.data;
        }else if(objectCtrl.data){
            objectCtrl.setOriginalData($.extend(true, {}, objectCtrl.data));
            $scope.linkData = objectCtrl.data;
        }
       // $("#basicModule").css("background-color", "#49C2FC");
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
        highLightLink.drawOfLinkForInit();
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
    $scope.changeModule = function (url,ind) {
        $scope.changeActive(ind);
        if (url === "basicModule") {
            //$scope.changeActive(0);
            $ocLazyLoad.load('ctrl/linkCtrl/basicCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/basicTepl.html";
            });
        } else if (url === "paginationModule") {
           // $scope.changeActive(2);
            $ocLazyLoad.load('ctrl/linkCtrl/pedestrianNaviCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/pedestrianNaviTepl.html";
            });
        } else if (url === "realtimeModule") {
            //$scope.changeActive(3);
            $ocLazyLoad.load('ctrl/linkCtrl/realtimeTrafficCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/realtimeTrafficTepl.html";
            });
        } else if (url === "zoneModule") {
           // $scope.changeActive(4);
            $ocLazyLoad.load('ctrl/linkCtrl/zonePeopertyCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/zonePeopertyTepl.html";
            });
        } else if (url === "limitedModule") {
           // $scope.changeActive(1);
            $ocLazyLoad.load('ctrl/linkCtrl/limitedCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/limitedTepl.html";
            });
        } else if (url == "otherModule") {
            //$scope.changeActive(5);
            $ocLazyLoad.load('ctrl/linkCtrl/otherCtrl').then(function () {
                $scope.currentURL = "js/tepl/linkObjTepl/otherTepl.html";
            });
        }
        //$("#currentObjectDiv").find(":button").css("background-color", "#fff");
        //$(".btn btn-primary").css("background-color", "#49C2FC");
    }
    $scope.angleOfLink=function(pointA,pointB) {
        var PI = Math.PI,angle;
       if(pointA.x-pointB.x===0) {
           angle = PI / 2;
       }else{
           angle = Math.atan((pointA.y - pointB.y) / (pointA.y - pointB.y));
       }
        return angle;

    };
    $scope.changeDirect = function (direct) {
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var point= {x:$scope.linkData.geometry.coordinates[0][0], y:$scope.linkData.geometry.coordinates[0][1]};
        var pointVertex= {x:$scope.linkData.geometry.coordinates[1][0], y:$scope.linkData.geometry.coordinates[1][1]};
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag:true,
            pid:$scope.linkData.pid,
            point: point,
            type: "marker",
            angle:angle,
            orientation:direct.toString()
        };
        var editLayer = layerCtrl.getLayerById('edit');
        layerCtrl.pushLayerFront('edit');
        var sobj = shapeCtrl.shapeEditorResult;
        editLayer.drawGeometry =  marker;
        editLayer.draw( marker, editLayer);
        sobj.setOriginalGeometry( marker);
        sobj.setFinalGeometry(marker);
        shapeCtrl.setEditingType("transformDirect");
        shapeCtrl.startEditing();
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
        //if( shapeCtrl.shapeEditorResult.getFinalGeometry()) {
        //    console.log(shapeCtrl.shapeEditorResult.getFinalGeometry());
        //    return;
        //}
        /*如果普通限制修改时间段信息*/
        if($scope.linkData.limits){
            $.each($scope.linkData.limits,function(i,v){
                $.each($("#popularLimitedDiv").find(".muti-date"),function(m,n){
                    if(i == m){
                        v.timeDomain = $(n).attr('date-str');
                        delete v.pid;
                    }
                });
            });
        }
        /*如果卡车限制修改时间段信息*/
        if($scope.linkData.limitTrucks){
            $.each($scope.linkData.limitTrucks,function(i,v){
                        // console.log(v.pid)
                $.each($("#trafficLimited").find(".muti-date"),function(m,n){
                    if(i == m){
                        v.timeDomain = $(n).attr('date-str');
                        // delete v.pid;
                    }
                });
            });
        }
        /*如果道路名新增*/
        if($scope.linkData.names){
            $.each($scope.linkData.names,function(i,v){
                if(v.pid)
                    delete v.pid;
            });
        }
        objectCtrl.setCurrentObject($scope.linkData);
        objectCtrl.save();
        if(objectCtrl.changedProperty.limits){
            if(objectCtrl.changedProperty.limits.length > 0){
                $.each(objectCtrl.changedProperty.limits,function(i,v){
                    delete v.pid;
                });
            }
        }
        if(objectCtrl.changedProperty.limitTrucks){
            if(objectCtrl.changedProperty.limitTrucks.length > 0){
                $.each(objectCtrl.changedProperty.limitTrucks,function(i,v){
                    delete v.pid;
                });
            }
        }
        var param = {
            "command": "UPDATE",
            "type":"RDLINK",
            "projectId": 11,
            "data": objectCtrl.changedProperty
        };
        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                rdLink.redraw();
                if(shapeCtrl.shapeEditorResult.getFinalGeometry()!==null) {
                    if (typeof map.currentTool.cleanHeight === "function") {
                        map.currentTool.cleanHeight();
                    }
                    if (toolTipsCtrl.getCurrentTooltip()) {
                        toolTipsCtrl.onRemoveTooltip();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                if(data.errcode==0){
                    swal("操作成功",'保存成功！', "success");

                }
            } else {
                swal("操作失败", data.errmsg, "error");
            }
            if (data.errcode==0) {
                var sinfo={
                    "op":"修改道路link成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.unshift(sinfo);
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })

    };
    $scope.$parent.$parent.delete = function () {
        var objId = parseInt($scope.linkData.pid);
        var param = {
            "command": "DELETE",
            "type":"RDLINK",
            "projectId": 11,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"删除道路link成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.unshift(sinfo);
                info=data.data.log;
            }else{
                info=[{
                         "op":data.errcode,
                          "type":data.errmsg,
                          "pid": data.errid
                    }];
            }

            //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"
            if (data.errmsg != "此link上存在交限关系信息，删除该Link会对应删除此组关系") {
                rdLink.redraw();
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
                $scope.linkData = null;
                var editorLayer = layerCtrl.getLayerById("edit")
                editorLayer.clear();
                $scope.$parent.$parent.objectEditURL = "";
            } else {
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
            }

        })
    }

    $scope.changeLink=function(ind,linkid){
        $scope.brigeIndex=ind;
        Application.functions.getRdObjectById(linkid, "RDLINK", function (data) {
            if (data.errcode === -1) {
                return;
            }
            var linkArr = data.data.geometry.coordinates || data.geometry.coordinates, points = [];
            for (var i = 0, len = linkArr.length; i < len; i++) {
                var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                points.push(point);
            }
            map.panTo({lat: points[0].y, lon: points[0].x});
            var line = fastmap.mapApi.lineString(points);
            selectCtrl.onSelected({geometry: line, id: $scope.dataId});
            objectCtrl.setCurrentObject(data);
            if (objectCtrl.updateObject !== "") {
                objectCtrl.updateObject();
            }
            $ocLazyLoad.load("ctrl/linkObjectCtrl").then(function () {
                $scope.$parent.$parent.objectEditURL = "js/tepl/currentObjectTepl.html";
            });
        });
    }
}]);