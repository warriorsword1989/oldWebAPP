/**
 * Created by liwanchong on 2015/10/22.
 */
var dataTipsApp = angular.module('mapApp', ['oc.lazyLoad']);
dataTipsApp.controller("sceneTipsController",['$scope', '$ocLazyLoad',  function ($scope,$ocLazyLoad) {

        var dataTipsCtrl = new fastmap.uikit.DataTipsController();
        var selectCtrl = new fastmap.uikit.SelectController();
        var checkCtrl = fastmap.uikit.CheckResultController();
        var layerCtrl = fastmap.uikit.LayerController();
        var outPutCtrl = fastmap.uikit.OutPutController();
        var objEditCtrl = fastmap.uikit.ObjectEditController();
        $scope.restrictLayer = layerCtrl.getLayerById("referencePoint");
        $scope.workPointLayer = layerCtrl.getLayerById("workPoint");
        $scope.dataTipsData = selectCtrl.rowKey;
        if (selectCtrl.rowKey) {
            $scope.rdSubTipsData = selectCtrl.rowKey.o_array[0];

        } else {
            $scope.rdSubTipsData = [];
        }
        //获取数据中的图片数组
        $scope.photoTipsData = selectCtrl.rowKey.f_array;
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

        $scope.photos = [];
        for (var i in  $scope.photoTipsData) {
            if ($scope.photoTipsData[i].type === 1) {
                var content = Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.photoTipsData[i].content + '",type:"thumbnail"}';
                $scope.photos.push(content);
                console.log($scope.photos);
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


        //查看相关的推出线
        $scope.showOutLink = function (item) {
            $scope.rdSubTipsData = item;
        };
        $scope.$parent.$parent.updateDataTips = function (data) {
            $scope.photos.length = 0;
            if ($scope.showContent) {
                $scope.showContent = "";
            }
            $scope.dataTipsData = data;
            $scope.rdSubTipsData = data.o_array[0];
            //获取数据中的图片数组
            $scope.photoTipsData = data.f_array;
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

        $scope.closeDataTips = function () {
            $("#popoverTips").css("display", "none");
        };
        $scope.increaseDataTips = function () {
            Application.functions.getRdObjectById($scope.dataTipsData.in.id, "RDLINK", function (data) {
                var restrictObj = {};
                restrictObj["inLinkPid"] =parseInt($scope.dataTipsData.in.id);
                var dataTipsGeo = $scope.dataTipsData.g_location.coordinates;
                var outLinkPids = [];
                for (var outNum = 0, outLen = $scope.dataTipsData.o_array.length; outNum < outLen; outNum++) {
                    var outLinks = $scope.dataTipsData.o_array[outNum].out;
                    if(!outLinks) {
                        alert("没有退出线，请手动建立交限");
                        return;
                    }
                    for (var outLinksN = 0, outLinksL = outLinks.length; outLinksN < outLinksL; outLinksN++) {
                        outLinkPids.push(parseInt(outLinks[outLinksN].id));
                    }
                }
                restrictObj["outLinkPids"] = outLinkPids;
                var inLinkGeo = data.data.geometry.coordinates;
                var inNode, linksGeoLen = inLinkGeo.length - 1;
                if (data.data.direct === 1) {
                    var dataTipsToStart = Math.abs(dataTipsGeo[0] - inLinkGeo[0][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[0][1]);
                    var dataTipsToEnd = Math.abs(dataTipsGeo[0] - inLinkGeo[inLinkGeo.length - 1][0]) + Math.abs(dataTipsGeo[1] - inLinkGeo[inLinkGeo.length - 1][1]);
                    if (dataTipsToStart - dataTipsToEnd) {
                        inNode = parseInt(data.data.eNodePid)
                    } else {
                        inNode = parseInt(data.data.sNodePid);
                    }
                } else {

                    if (data.data.direct === 2) {
                        inNode =parseInt(data.data.eNodePid) ;
                    } else if (data.data.direct === 3) {
                        inNode = parseInt(data.data.sNodePid);
                    }

                };
                restrictObj["nodePid"] = inNode;
                var param = {
                    "command": "createrestriction",
                    "projectId": 1,
                    "data": restrictObj
                };
                Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                    if(data.errcode===-1) {
                        outPutCtrl.pushOutput(data.errmsg);
                        return;
                    }
                    var pid = data.data.log[0].pid;
                    checkCtrl.setCheckResult(data);
                    $scope.restrictLayer.redraw();
                    $scope.workPointLayer.redraw();
                    outPutCtrl.pushOutput(data.data.log[0]);
                    //修改状态
                    var stageParam = {
                        "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                        "stage": 3,
                        "handler": 0

                    }
                    Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                        outPutCtrl.pushOutput(data.data+"\n");
                    });
                    Application.functions.getRdObjectById(pid, "RDRESTRICTION", function (data) {
                        objEditCtrl.setCurrentObject(data.data);
                        $scope.type = "";
                        $scope.$parent.$parent.rdRestrictData = data.data;
                        $ocLazyLoad.load('ctrl/objectEditCtrl').then(function () {
                            $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                            if ($scope.$parent.$parent.updateLinkData !== "") {
                                $scope.$parent.$parent.updateLinkData(data.data);
                            }

                        })
                    })

                });
            });

        };
        $scope.transDataTips = function () {
            var outLink = "", details = [], detailsOfTips = [];
            //$scope.$parent.$parent.rdRestrictData.inLinkPid = this.dataTipsData.in.id;

            details = this.dataTipsData.o_array;
            for (var i = 0, len = details.length; i < len; i++) {
                var outLinks = details[i].out, outLinkObj = {};
                if (outLinks) {
                    for (var j = 0, lenJ = outLinks.length; j < lenJ; j++) {
                        outLinkObj.conditions = [];
                        outLinkObj.outLinkPid = outLinks[j].id;
                        outLinkObj.flag = details[i].flag;
                        outLinkObj.relationshipType = 0;
                        outLinkObj.restricInfo = details[i].oInfo;
                        outLinkObj.type = outLinks[j].type;
                        if (details[i].vt === 1) {
                            var cArr = details[i].c_array;
                            for (var k = 0, lenk = cArr.length; k < lenk; k++) {
                                var cObj = {};
                                cObj.resAxleCount = cArr[k].aCt;
                                cObj.resAxleLoad = cArr[k].aLd;
                                cObj.resOut = cArr[k].rOt;
                                cObj.resTrailer = cArr[k].tra;
                                cObj.resWeigh = cArr[k].w;
                                cObj.timeDomain = cArr[k].time;
                                cObj.vehicle = 4;
                                outLinkObj.conditions.push(cObj);
                            }
                        }
                    }
                } else {
                    outLinkObj.conditions = [];
                    outLinkObj.outLinkPid = "无退出线";
                    outLinkObj.flag = details[i].flag;
                    outLinkObj.relationshipType = 0;
                    outLinkObj.restricInfo = details[i].oInfo;
                    outLinkObj.type = outLinks[j].type;
                    if (details[i].vt === 1) {
                        var cArr = details[i].c_array;
                        for (var k = 0, lenk = cArr.length; k < lenk; k++) {
                            var cObj = {};
                            cObj.resAxleCount = cArr[k].aCt;
                            cObj.resAxleLoad = cArr[k].aLd;
                            cObj.resOut = cArr[k].rOt;
                            cObj.resTrailer = cArr[k].tra;
                            cObj.resWeigh = cArr[k].w;
                            cObj.timeDomain = cArr[k].time;
                            cObj.vehicle = 4;
                            outLinkObj.conditions.push(cObj);
                        }
                    }
                }

                detailsOfTips.push(outLinkObj);

            }
            $scope.$parent.$parent.rdRestrictData.details = detailsOfTips;
            $scope.$parent.$parent.rdRestrictData.stage = 3;
            if ($scope.$parent.$parent.updateRestrictData) {
                $scope.$parent.$parent.updateRestrictData($scope.$parent.$parent.rdRestrictData);
            }
        }

        $scope.openOrigin = function (id) {
            $scope.openshotoorigin = selectCtrl.rowKey.f_array[id];
            $("#dataTipsOriginImg").attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
            $("#dataTipsOriginModal").modal('show');
        }
    }]);