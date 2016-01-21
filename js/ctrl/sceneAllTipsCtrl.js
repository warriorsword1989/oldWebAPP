/**
 * Created by liuzhaoxia on 2016/1/5.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneAllTipsController", function ($scope, $timeout, $ocLazyLoad) {
    var dataTipsCtrl = new fastmap.uikit.DataTipsController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var restrictLayer = layerCtrl.getLayerById("referencePoint");
    var workPoint = layerCtrl.getLayerById("workPoint");
    var speedlimtPoint=layerCtrl.getLayerById("speedlimit");
    //清除地图上的高亮的feature
    if (highLightLayer.highLightLayersArr.length !== 0) {
        highLightLayer.removeHighLightLayers();
    }
    $scope.outIdS = [];
    selectCtrl.updateTipsCtrl = function () {
        initializeDataTips();
    }
    if (selectCtrl.rowKey) {
        //dataTips的初始化数据
        initializeDataTips();

    } else {
        $scope.rdSubTipsData = [];
    }

    //初始化DataTips相关数据
    function initializeDataTips() {
        $scope.photoTipsData = [];
        $scope.photos = [];
        $scope.dataTipsData = selectCtrl.rowKey;
        $scope.allTipsType = $scope.dataTipsData.s_sourceType;
        var highLightDataTips = new fastmap.uikit.HighLightRender(workPoint, {
            map: map,
            highLightFeature: "dataTips",
            dataTips: $scope.dataTipsData.rowkey
        });
        highLightDataTips.drawTipsForInit();
        highLightLayer.pushHighLightLayers(highLightDataTips);
        //显示状态
        if ($scope.dataTipsData) {
            switch ($scope.dataTipsData.t_lifecycle) {
                case 1:
                    $scope.showContent = "外业删除";
                    break;
                case 2:
                    $scope.showContent = "外业修改";
                    break;
                case 3:
                    $scope.showContent = "外业新增";
                    break;
                case 0:
                    $scope.showContent = "默认值";
                    break;
            }
        }
        switch ($scope.allTipsType) {
            case "1101":
                $scope.speedDirectTypeOptions = [
                    {"id": 0, "label": "0  未调查"},
                    {"id": 2, "label": "2 顺方向"},
                    {"id": 3, "label": "3 逆方向"}
                ];
                for (var i in $scope.speedDirectTypeOptions) {
                    if ($scope.speedDirectTypeOptions[i].id == $scope.dataTipsData.rdDir) {
                        $scope.rdDir = $scope.speedDirectTypeOptions[i].label;
                    }
                }
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
                for (var i in $scope.limitSrcOption) {
                    if ($scope.limitSrcOption[i].id == $scope.dataTipsData.src) {
                        $scope.limitSrc = $scope.limitSrcOption[i].label;
                    }
                }
                break;
            case "1201":
                break;
            case "1203"://道路方向
                if ($scope.dataTipsData.dr == 1) {
                    $scope.drs = "双方向";
                } else {
                    $scope.drs = "单方向";
                }
                $scope.fData = $scope.dataTipsData.f;
                break;
            case "1301"://车信
                $scope.oarrayData = $scope.dataTipsData.o_array;
                for (var i in $scope.oarrayData) {
                    //.d_array[$index].out[$index].id
                    for (var j in $scope.oarrayData[i].d_array) {
                        for (var m in $scope.oarrayData[i].d_array[j].out) {
                            $scope.outIdS.push({id: $scope.oarrayData[i].d_array[j].out[m].id});
                        }
                    }
                }
                break;
            case "1302":
                break;
            case "1407":
                break;
            case "1510"://桥
                $scope.brigeArrayLink=$scope.dataTipsData.f_array;
                console.log($scope.brigeArrayLink)
                break;
            case "1604"://区域内道路
                $scope.fData = $scope.dataTipsData.f_array;
                break;
            case "1704"://交叉路口
                $scope.fData = $scope.dataTipsData;
                break;
            case "1803":
                break;
            case "1901":
                break;
            case "2001":
                break;

        }

        //获取数据中的图片数组
        if (!$scope.photos) {
            $scope.photos = [];
        }

        $scope.photoTipsData = selectCtrl.rowKey.f_array;


        for (var i in  $scope.photoTipsData) {
            if ($scope.photoTipsData[i].type === 1) {
                var content = Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.photoTipsData[i].content + '",type:"thumbnail"}';
                $scope.photos.push(content);
            } else if ($scope.photoTipsData[i].type === 3) {
                $scope.remarksContent = $scope.photoTipsData[i].content;
            }

        }
        if ($scope.photos.length != 0 && $scope.photos.length < 4) {
            for (var a = $scope.photos.length; a < 4; a++) {
                var imgs = "./css/img/noimg.png";
                $scope.photos.push(imgs);
            }
        } else {
            for (var j = 0; j < 4; j++) {
                var newimgs = "./css/img/noimg.png";
                $scope.photos.push(newimgs);
            }
        }
        $timeout(function () {
            $ocLazyLoad.load('ctrl/fmdateTimer').then(function () {
                $scope.dateReadyURL = 'js/tepl/fmdateTimerReadonly.html';
                /*查询数据库取出时间字符串*/
                var tmpStr = $scope.dataTipsData.time;
                $scope.fmdateTimer(tmpStr);
            });
        })
        /*时间控件*/
        $scope.fmdateTimer = function (str) {
            /*获取新数据*/
            $scope.$on('get-date', function (event, data) {
                $scope.codeOutputRead = data;
            });
            $timeout(function () {
                $scope.$broadcast('set-code', str);
                $scope.codeOutputRead = str;
                $scope.$apply();
            }, 100);
        }
    };

    $scope.upBridgeStatus=function() {
        if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0

            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                var outputcontroller = fastmap.uikit.OutPutController({});
                var info = [];
                if (data.data) {
                    $.each(data.data.log, function (i, item) {
                        if (item.pid) {
                            info.push(item.op + item.type + "(pid:" + item.pid + ")");
                        } else {
                            info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                        }
                    });
                } else {
                    info.push(data.errmsg + data.errid);
                }
                outputcontroller.pushOutput(info);
                if (outputcontroller.updateOutPuts !== "") {
                    outputcontroller.updateOutPuts();
                }
                $scope.$parent.$parent.rowkeyOfDataTips = undefined;
            })
        }
    }

    $scope.closeTips=function(){
        $("#popoverTips").css("display", "none");
    }
});