/**
 * Created by liwanchong on 2015/10/22.
 */
var dataTipsApp = angular.module("lazymodule", []);
dataTipsApp.controller("sceneTipsController", function ($scope) {

    var dataTipsCtrl = new fastmap.uikit.DataTipsController();
    var selectCtrl = new fastmap.uikit.SelectController();

    if (selectCtrl.rowKey) {
        $scope.rdSubTipsData = selectCtrl.rowKey.o_array[0];

    } else {
        $scope.rdSubTipsData = [];
    }
    //获取数据中的图片数组
    $scope.photoTipsData = selectCtrl.rowKey.f_array;
    $scope.photos = $.extend(true, {}, $scope.photoTipsData);//复制为一个新的数组
    for (var i in  $scope.photoTipsData) {
        $scope.photos[i].content = Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.photoTipsData[i].content + '",type:"thumbnail"}';
    }
    $scope.dataTipsData = selectCtrl.rowKey;
    $scope.closeDataTips = function () {
        $("#popoverTips").css("display", "none");
    };
    switch($scope.dataTipsData.t_lifecycle){
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

    $scope.increaseDataTips = function () {
        var outLink = "", details = [], detailsOfTips = [];
        $scope.$parent.$parent.rdRestrictData.pid = this.dataTipsData.in.id;
        $scope.$parent.$parent.rdRestrictData.inLinkPid = this.dataTipsData.in.id;

        details = this.dataTipsData.o_array;
        for (var i = 0, len = details.length; i < len; i++) {
            var outLinks = details[i].out, outLinkObj = {};

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
            detailsOfTips.push(outLinkObj);

        }
        $scope.$parent.$parent.rdRestrictData.details = detailsOfTips;
        $scope.$parent.$parent.rdRestrictData.stage = 3;

    };
    $scope.transDataTips = function () {
        var outLink = "", details = [], detailsOfTips = [];
        $scope.$parent.$parent.rdRestrictData.inLinkPid = this.dataTipsData.in.id;

        details = this.dataTipsData.o_array;
        for (var i = 0, len = details.length; i < len; i++) {
            var outLinks = details[i].out, outLinkObj = {};

            for (var j = 0, lenJ = outLinks.length; j < lenJ; j++) {
                outLinkObj.conditions = [];
                outLinkObj.outLinkPid = outLinks[j].id;
                outLinkObj.flag = details[i].flag;
                outLinkObj.relationshipType = 0;
                outLinkObj.restricInfo = details[i].oInfo;
                outLinkObj.type = outLinks[j].type
                outLinkObj.vias = [];
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
        $scope.$parent.$parent.rdRestrictData.rowkeyOfDataTips = this.dataTipsData.rowkey;
    }

    $scope.openOrigin = function (id) {
        $scope.openshotoorigin = selectCtrl.rowKey.f_array[id];
        $("#dataTipsOriginImg").attr("src", Application.url + '/fcc/photo/getSnapshotByRowkey?parameter={"rowkey":"' + $scope.openshotoorigin.content + '",type:"origin"}');
        $("#dataTipsOriginModal").modal('show');
    }
});