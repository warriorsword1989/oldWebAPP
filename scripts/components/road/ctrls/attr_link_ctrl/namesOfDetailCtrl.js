/**
 * Created by liwanchong on 2016/3/2.
 */
var namesOfLinkApp = angular.module("app");
namesOfLinkApp.controller("namesOfLinkController", ['$scope', '$timeout', 'dsMeta', function($scope, $timeout, dsMeta) {
    $scope.srcFlagOptions = [
        {
            "id": 0,
            "label": "0 现场道路名标牌"
        },
        {
            "id": 1,
            "label": "1 现场概略图"
        },
        {
            "id": 2,
            "label": "2 方向看板"
        },
        {
            "id": 3,
            "label": "3 旅游图"
        },
        {
            "id": 4,
            "label": "4 点门牌"
        },
        {
            "id": 5,
            "label": "5 线门牌"
        },
        {
            "id": 6,
            "label": "6 其他"
        },
        {
            "id": 9,
            "label": "9 来源无法确定"
        }
    ];
    $scope.routeAttOptions = [
        {
            "id": 0,
            "label": "0 工作中"
        },
        {
            "id": 1,
            "label": "1 上行"
        },
        {
            "id": 2,
            "label": "2 下行"
        },
        {
            "id": 3,
            "label": "3 环状"
        },
        {
            "id": 4,
            "label": "4 内环"
        },
        {
            "id": 5,
            "label": "5 外环"
        },
        {
            "id": 9,
            "label": "9 未定义"
        }
    ];
    $scope.nameTypeOptions = [
        {
            "id": 0,
            "label": "普通"
        },
        {
            "id": 1,
            "label": "立交桥名(连接路)"
        },
        {
            "id": 2,
            "label": "立交桥名(主路)"
        },
        {
            "id": 3,
            "label": "风景路线"
        },
        {
            "id": 4,
            "label": "桥"
        },
        {
            "id": 5,
            "label": "隧道"
        },
        {
            "id": 6,
            "label": "虚拟名称"
        },
        {
            "id": 7,
            "label": "出口编号"
        },
        {
            "id": 8,
            "label": "编号名称"
        },
        {
            "id": 9,
            "label": "虚拟连接名称"
        },
        {
            "id": 14,
            "label": "点门牌"
        },
        {
            "id": 15,
            "label": "线门牌"
        }
    ];
    $scope.roadTypeOptions = {
        0: "未区分",
        1: "高速",
        2: "国道",
        3: "铁路",
        4: "出口编号",
    };
    var objCtrl = fastmap.uikit.ObjectEditController();
    //$scope.names = objCtrl.namesInfo;
    var index = $scope.subAttributeData;
    $scope.subAttributeData = "";
    $scope.names = objCtrl.data.names;
    $scope.oridiData = $scope.names[index];
    // $scope.realtimeData = objCtrl.data;
    //
    // for(var i= 0,len=$scope.names.length;i<len;i++) {
    //     if($scope.names[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
    //         $scope.oridiData = $scope.names[i];
    //     }
    // }
    //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
    if ($scope.nameDetailForm) {
        $scope.nameDetailForm.$setPristine();
    }
    $scope.addRoadName = function() {
        var newName = fastmap.dataApi.linkname({
            "linkPid": objCtrl.data.pid
        });
        $scope.names.unshift(newName)
    };
    $scope.minusRoadName = function(id) {
        $scope.names.splice(id, 1);
        if ($scope.names.length === 0) {}
    };
    /*点击翻页*/
    $scope.goPaging = function() {
        if ($scope.picNowNum == 0) {
            if ($scope.picTotal == 0 || $scope.picTotal == 1) {
                $(".pic-next").prop('disabled', 'disabled');
            } else {
                $(".pic-next").prop('disabled', false);
            }
            $(".pic-pre").prop('disabled', 'disabled');
        } else {
            if ($scope.picTotal - ($scope.picNowNum + 1) == 0) {
                $(".pic-next").prop('disabled', 'disabled');
            } else {
                $(".pic-next").prop('disabled', false);
            }
            $(".pic-pre").prop('disabled', false);
        }
        //$scope.$apply();
    }
    $scope.picNowNum = 0;
    //$scope.pagesize=0;
    $scope.getPicsDate = function() {
        var nameParameter = {
            "name": $scope.inNmae,
            "pageSize": $scope.pagesize,
            "pageNum": $scope.picNowNum,
            "dbId": App.Temp.dbId
        };
        dsMeta.getNamesbyName(nameParameter).then(function(data) {
            if (data != -1) {
                $(".pic-loading").hide();
                //$("#namesDiv").css("display", "block");
                $scope.pictures = data.data.data;
                $scope.picTotal = Math.ceil(data.data.total / 5);
                $scope.goPaging();
                //$scope.$apply();
            }
        });
    };
    $scope.selectNameInd = 0;
    $scope.searchGroupidByNames = function() {
        $scope.pagesize = 5; //$("#pagesize").val();
        $scope.inNmae = $scope.oridiData.name;
        $timeout(function() {
            $scope.picNowNum = 0;
            $scope.getPicsDate();
            if ($.trim($scope.inNmae) == '') {
                $('.pic-show').hide();
            } else {
                $('.pic-show').show();
            }
        }, 100);
    };
    $scope.selectNmaesId = function(nameid, name) {
        // $scope.names[$scope.selectNameInd].nameGroupid=nameid;
        // $scope.names[$scope.selectNameInd].name=name;
        $scope.oridiData.nameGroupid = nameid;
        $scope.oridiData.name = name;
        $('.pic-show').hide();
    };
    /*箭头图代码点击下一页*/
    $scope.picNext = function() {
        $scope.picNowNum += 1;
        $scope.getPicsDate();
    };
    /*箭头图代码点击上一页*/
    $scope.picPre = function() {
        $scope.picNowNum -= 1;
        $scope.getPicsDate();
    };
    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function(e) {
        $(e.target).parents('.pic-show').hide();
    };
    $scope.changeColor = function(ind) {
        $("#minusNameSpan" + ind).css("color", "#FFF");
    };
    $scope.backColor = function(ind) {
        $("#minusNameSpan" + ind).css("color", "darkgray");
    }
    var oldNameClass = $scope.oridiData.nameClass;
    $scope.nameClassChange = function() {
        var newSeqNum = 0;
        var oldSeqNum = $scope.oridiData.seqNum;
        var newNameClass = $scope.oridiData.nameClass;
        $scope.oridiData.seqNum = 0;
        for (var i = 0; i < $scope.names.length; i++) {
            if (i != index && $scope.names[i].nameClass == newNameClass && $scope.names[i].seqNum > newSeqNum) {
                newSeqNum = $scope.names[i].seqNum;
            }
            if ($scope.names[i].nameClass == oldNameClass && $scope.names[i].seqNum > oldSeqNum) {
                $scope.names[i].seqNum--;
            }
        }
        $scope.oridiData.seqNum = newSeqNum + 1;
        oldNameClass = newNameClass;
    }
}]);