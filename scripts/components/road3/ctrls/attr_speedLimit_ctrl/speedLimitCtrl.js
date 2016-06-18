/**
 * Created by liuzhaoxia on 2015/12/11.
 */

var selectApp = angular.module("app");
selectApp.controller("speedlimitTeplController", function ($scope, $timeout, $ocLazyLoad) {
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var layerCtrl = fastmap.uikit.LayerController();
    var speedLimit = layerCtrl.getLayerById('speedlimit');
    var eventController = fastmap.uikit.EventController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    $scope.carSpeedType=false;
    $scope.initializeData = function () {
        alert('kai')
        $scope.speedLimitData = objectEditCtrl.data;
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        $scope.speedLimitGeometryData = objectEditCtrl.data.geometry;
        highRenderCtrl.highLightFeatures.push({
            id:$scope.speedLimitData.linkPid.toString(),
            layerid:'referenceLine',
            type:'line',
            style:{}
        });
        highRenderCtrl.highLightFeatures.push({
            id:$scope.speedLimitData.pid,
            layerid:'relationdata',
            type:'relationdata',
            style:{}
        })
        highRenderCtrl.drawHighlight();

        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.speedLimitForm) {
            $scope.speedLimitForm.$setPristine();
        }
    }
    if(objectEditCtrl.data){
        $scope.initializeData();
    }
    $scope.speedTypeOptions = [
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "指示牌"},
        {"id": 3, "label": "特定条件"},
        {"id": 4, "label": "车道限速"}
    ];
    $scope.speedDirectTypeOptions = [
        {"id": 0, "label": "0  未调查"},
        {"id": 2, "label": "2 顺方向"},
        {"id": 3, "label": "3 逆方向"}
    ];
    $scope.speedDependentOption = [
        {"id": 0, "label": "0  无"},
        {"id": 1, "label": "1 雨天(Rain)"},
        {"id": 2, "label": "2 雪天(Snow)"},
        {"id": 3, "label": "3 雾天(Fog)"},
        {"id": 6, "label": "6 学校(School)"},
        {"id": 10, "label": "10 时间限制"},
        {"id": 11, "label": "11 车道限制"},
        {"id": 12, "label": "12 季节时段"},
        {"id": 13, "label": "13 医院"},
        {"id": 14, "label": "14 购物"},
        {"id": 15, "label": "15 居民区"},
        {"id": 16, "label": "16 企事业单位"},
        {"id": 17, "label": "17 景点景区"},
        {"id": 18, "label": "18 交通枢纽"}
    ];
    $scope.limitSrcOption = [
        {"id": 0, "label": "0  无"},
        {"id": 1, "label": "1 现场标牌"},
        {"id": 2, "label": "2 城区标识"},
        {"id": 3, "label": "3 高速标识"},
        {"id": 4, "label": "4 车道限速"},
        {"id": 5, "label": "5 方向限速"},
        {"id": 6, "label": "6 机动车限速"},
        {"id": 7, "label": "7 匝道未调查"},
        {"id": 8, "label": "8 缓速行驶"},
        {"id": 9, "label": "9 未调查"}
    ];
    $scope.speedLimitValue=$scope.speedLimitData.speedValue/10;
    $timeout(function(){
        $ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
            $scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            /*查询数据库取出时间字符串*/
            var tmpStr = $scope.speedLimitData.timeDomain;
            //$scope.fmdateTimer(tmpStr);
        });
    });
    /*时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.codeOutput = data;
            $scope.speedLimitData.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.codeOutput = str;
            $scope.speedLimitData.timeDomain = str;
            $scope.$apply();
        }, 100);
    }

    $scope.save = function () {
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDSPEEDLIMIT",
            "projectId": Application.projectid,
            "data": objectEditCtrl.changedProperty
        };

        if(!objectEditCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }

        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            var info=null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"修改RDSPEEDLIMIT成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                swal("操作成功",'修改成功！', "success");
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
                info=data.data.log;
                speedLimit.redraw();
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
    $scope.delete = function () {
        var objId = parseInt($scope.speedLimitData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDSPEEDLIMIT",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            if (data.errcode === -1) {
                return;
            }
            speedLimit.redraw();
            $scope.speedLimitData = null;
            $scope.speedLimitGeometryData = null;
            var info = null;
            if (data.errcode == 0) {
                var sinfo = {
                    "op": "删除RDSPEEDLIMIT成功",
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
            //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"

            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();

            }

        })
    };
    $scope.cancel=function() {

    };


    //箭头方向
    $scope.changeDirect = function (direct) {
        map.currentTool = shapeCtrl.getCurrentTool();
        map.currentTool.disable();
        var containerPoint;
        var point= {x:$scope.speedLimitData.geometry.coordinates[0], y:$scope.speedLimitData.geometry.coordinates[1]};
        var pointVertex= {x:$scope.speedLimitData.geometry.coordinates[0], y:$scope.speedLimitData.geometry.coordinates[1]};
        containerPoint = map.latLngToContainerPoint([point.y, point.x]);
        pointVertex = map.latLngToContainerPoint([pointVertex.y, pointVertex.x]);
        var angle = $scope.angleOfLink(containerPoint, pointVertex);
        var marker = {
            flag:true,
            pid:$scope.speedLimitData.pid,
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

    $scope.angleOfLink=function(pointA,pointB) {
        var PI = Math.PI,angle;
        if((pointA.x-pointB.x)===0) {
            angle = PI / 2;
        }else{
            angle = Math.atan((pointA.y - pointB.y) / (pointA.x - pointB.x));
        }
        return angle;

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);


});
