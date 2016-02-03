/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("rdCrossController", function ($scope,$timeout) {
    var layerCtrl = fastmap.uikit.LayerController();
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdcross = layerCtrl.getLayerById('rdcross');
    $scope.langCodeOptions = [
        {"id": "CHI", "label": "简体中文"},
        {"id": "CHT", "label": "繁体中文"},
        {"id": "ENG", "label": "英文"},
        {"id": "POR", "label": "葡萄牙文"},
        {"id": "ARA", "label": "阿拉伯语"},
        {"id": "BUL", "label": "保加利亚语"},
        {"id": "CZE", "label": "捷克语"},
        {"id": "DAN", "label": "丹麦语"},
        {"id": "DUT", "label": "荷兰语"},
        {"id": "FIN", "label": "芬兰语"},
        {"id": "FRE", "label": "法语"},
        {"id": "GER", "label": "德语"},
        {"id": "HIN", "label": "印地语"},
        {"id": "HUN", "label": "匈牙利语"},
        {"id": "ICE", "label": "冰岛语"},
        {"id": "IND", "label": "印度尼西亚语"},
        {"id": "ITA", "label": "意大利语"},
        {"id": "JPN", "label": "日语"},
        {"id": "KOR", "label": "韩语"},
        {"id": "LIT", "label": "立陶宛语"},
        {"id": "NOR", "label": "挪威语"},
        {"id": "POL", "label": "波兰语"},
        {"id": "RUM", "label": "罗马尼西亚语"},
        {"id": "RUS", "label": "俄语"},
        {"id": "SLO", "label": "斯洛伐克语"},
        {"id": "SPA", "label": "西班牙语"},
        {"id": "SWE", "label": "瑞典语"},
        {"id": "THA", "label": "泰国语"},
        {"id": "TUR", "label": "土耳其语"},
        {"id": "UKR", "label": "乌克兰语"},
        {"id": "SCR", "label": "克罗地亚语"},
    ];

    var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
        map: map,
        highLightFeature: "linksOfCross",
        initFlag: true
    });
    highLightLayer.pushHighLightLayers(highLightLink);
    $scope.initializeRdCrossData = function () {
        objCtrl.setOriginalData($.extend(true, {}, objCtrl.data));
        $scope.rdCrossData = objCtrl.data;
        var links = $scope.rdCrossData.links,linkArr=[];
        for(var i= 0,len=links.length;i<len;i++) {
            linkArr.push(links[i]["linkPid"]);
        }
        highLightLink.drawLinksOfCrossForInit( linkArr, []);
        $("#signalbtn" + $scope.rdCrossData.signal).removeClass("btn btn-default").addClass("btn btn-primary");
        $("#typebtn" + $scope.rdCrossData.type).removeClass("btn btn-default").addClass("btn btn-primary");
        $("#electRoeyebtn" + $scope.rdCrossData.electroeye).removeClass("btn btn-default").addClass("btn btn-primary");
        $timeout(function () {
            for (var i in $scope.rdCrossData.names) {
                $("#srcFlag" + $scope.rdCrossData.names[i].srcFlag + "_" + i).removeClass("btn btn-default").addClass("btn btn-primary");
            }
            $scope.$apply();
        });
    };
    if (objCtrl.data) {
        $scope.initializeRdCrossData();
    }
    objCtrl.updateRdCross=function() {
        $scope.initializeRdCrossData();
    };
    $scope.checksignal = function (flag) {
        $("#signaldiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#signalbtn" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdCrossData.signal = flag;
    }

    $scope.checktype = function (flag) {
        $("#typediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#typebtn" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdCrossData.type = flag;
    }

    $scope.checkelectRoeye = function (flag) {
        $("#electRoeyediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#electRoeyebtn" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdCrossData.electRoeye = flag;
    }

    $scope.checksrcFlag = function (flag, item, index) {
        $("#srcFlagdiv" + index + " :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#srcFlag" + flag + "_" + index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.srcFlag = flag;
    }
    /*路口名称输入完查询发音和拼音*/
    $scope.diverName = function (id, name) {
        $scope.$parent.$parent.showLoading = true;  //showLoading
        var param = {
            "word": name
        }
        Application.functions.getNamePronunciation(JSON.stringify(param), function (data) {
            $scope.$parent.$parent.showLoading = false;  //showLoading
            $scope.$apply();
            if (data.errcode == 0) {
                $.each($scope.rdCrossData.names, function (i, v) {
                    if (v.nameGroupid == id) {
                        v.phonetic = data.data.phonetic;
                        //v.voiceFile = data.data.voicefile;
                    }
                });
                $scope.$apply();
            } else {
                swal("查找失败", "问题原因：" + data.errmsg, "error");
            }
        });
    }
    $scope.addrdCrossName = function () {
        if (!$("#namesDiv").hasClass("in")) {
            $("#namesDiv").addClass("in");
        }
        var names = $scope.rdCrossData.names, maxNum = -1;
        if (names.length === 0) {
            maxNum = 0;
        } else {
            for (var i = 0, len = names.length; i < len; i++) {
                if (names[i]["nameGroupid"] > maxNum) {
                    maxNum = names[i]["nameGroupid"];
                }
            }
        }

        $scope.rdCrossData.names.unshift({
            nameId: 0,
            nameGroupid: maxNum + 1,
            langCode: "CHI",
            name: "",
            phonetic: "",
            srcFlag: 0
        })
    }

    $scope.minusrdCrossName = function (id) {
        $scope.rdCrossData.names.splice(id, 1);
        if ($scope.rdCrossData.names.length === 0) {
            if ($("#namesDiv").hasClass("in")) {
                $("#namesDiv").removeClass("in");
            }
        }
    };
    $scope.$parent.$parent.save = function () {
        objCtrl.setCurrentObject($scope.rdCrossData);
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDCROSS",
            "projectId": 11,
            "data": objCtrl.changedProperty
        };

        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = [];
            if (data.data) {
                if ($scope.$parent.$parent.rowkeyOfDataTips !== undefined) {
                    var stageParam = {
                        "rowkey": $scope.$parent.$parent.rowkeyOfDataTips,
                        "stage": 3,
                        "handler": 0

                    }
                    Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
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
                            info.push(data.errmsg + data.errid)
                        }
                        outPutCtrl.pushOutput(info);
                        if (outPutCtrl.updateOutPuts !== "") {
                            outPutCtrl.updateOutPuts();
                        }
                        $scope.$parent.$parent.rowkeyOfDataTips = undefined;
                    })
                }
                $.each(data.data.log, function (i, item) {
                    if (item.pid) {
                        info.push(item.op + item.type + "(pid:" + item.pid + ")");
                    } else {
                        info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                    }
                });
            } else {
                info.push(data.errmsg + data.errid)
            }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })

    };
    $scope.$parent.$parent.delete = function () {
        var objId = parseInt($scope.rdCrossData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDCROSS",
            "projectId": 11,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = [];
            if(data.errcode == 0)
                rdcross.redraw();
            if (data.data) {
                $scope.rdCrossData = null;
                $scope.$parent.$parent.objectEditURL = "";
                $.each(data.data.log, function (i, item) {
                    if (item.pid) {
                        info.push(item.op + item.type + "(pid:" + item.pid + ")");
                    } else {
                        info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                    }
                });
            } else {
                info.push(data.errmsg + data.errid)
            }

            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })
    }
});